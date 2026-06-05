import type { BlogPost } from "../blogs";

export const blog06: BlogPost = {
  id: "blog-06",
  title: "Scaling Stateful WebSockets: Event-Driven Real-Time Sync with FastAPI & Redis",
  slug: "scaling-stateful-websockets-fastapi-broadcast",
  date: "April 10, 2026",
  readTime: "12 min read",
  excerpt: "Construct a robust, distributed WebSocket broadcast server using FastAPI and Redis Pub/Sub channels to sync state across multiple server nodes.",
  category: "Backend",
  tags: ["FastAPI", "WebSockets", "Redis", "Backend", "Event-Driven", "Pub/Sub"],
  metaDescription: "Step-by-step guide to scaling FastAPI WebSockets using Redis Pub/Sub. Learn how to broadcast message updates across multiple server instances.",
  metaKeywords: "FastAPI WebSockets, Redis Pub Sub, real-time message broadcasting, scale WebSockets Python, event-driven backend, async communication",
  content: `
### Introduction

WebSockets establish persistent, bi-directional communication channels between clients and servers. Unlike traditional HTTP requests, which follow a request-response cycle, WebSockets keep a socket connection open. This allows your backend server to push real-time updates (such as chat notifications, live dashboards, or collaborative state changes) to the client instantly, without waiting for the client to request updates.

While WebSockets work well on a single server, scaling this architecture presents challenges.

To handle increasing traffic, production systems run multiple instances of a server behind a load balancer (such as Nginx or an AWS Application Load Balancer). When User A connects to **Server Instance 1** and User B connects to **Server Instance 2**, they cannot communicate directly. Server 1 is unaware of User B's active socket connection, and Server 2 is unaware of User A's connection. If User A sends a message intended for User B, the message remains isolated on Server 1.

To solve this, we must build a distributed event broker using **Redis Pub/Sub** (Publish/Subscribe). When any server instance receives a WebSocket message, it publishes it to a shared Redis channel. Redis then broadcasts this message to all other active server instances, which forward it to their respective connected clients.

This guide details how to build a distributed WebSocket architecture using FastAPI and Redis.

---

### Redis Broadcast Architecture

The following diagram illustrates how a Redis Pub/Sub cluster distributes real-time events across multiple isolated server nodes to sync state across all connected clients:

\`\`\`
  [User Client A]              [User Client B]              [User Client C]
         │                            │                            │
         ▼ (WebSocket Link)           ▼ (WebSocket Link)           ▼ (WebSocket Link)
  +──────┴───────+             +──────┴───────+             +──────┴───────+
  |   Server 1   |             |   Server 2   |             |   Server 3   |
  +──────┬───────+             +──────┬───────+             +──────┬───────+
         │ (Publish)                  ▲ (Subscribe)                ▲ (Subscribe)
         │                            │                            │
         v                            │                            │
  +───────────────────────────────────┴────────────────────────────┴───────+
  |                           Redis Pub/Sub Bus                            |
  |                        (Channel: "ws_broadcast")                       |
  +------------------------------------------------------------------------+
\`\`\`

When Client A transmits a message, Server 1 publishes it to the shared Redis bus. Redis then forwards the message to Server 2 and Server 3, ensuring all clients receive the update.

---

### Step 1: Writing the Connection Manager in FastAPI

First, we build a local connection manager class to handle client socket handshakes, track active connections on the current server node, and handle disconnections.

\`\`\`python
# filepath: src/ws/manager.py
from typing import Dict
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self) -> None:
        # Map user identities to their active WebSocket connection channels
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket) -> None:
        '''
        Accepts the client's incoming socket connection and registers
        it within our in-memory node map.
        '''
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str) -> None:
        '''
        Removes the user connection from our active node map
        when a client disconnects.
        '''
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: str) -> None:
        '''
        Sends a private message to a specific connection on this server node.
        '''
        websocket = self.active_connections.get(user_id)
        if websocket:
            await websocket.send_text(message)

    async def broadcast_to_local_connections(self, message: str) -> None:
        '''
        Broadcasts a message to all users connected to this local server node.
        '''
        for websocket in self.active_connections.values():
            try:
                await websocket.send_text(message)
            except Exception:
                # Handle connection failures during broadcast loops
                pass
\`\`\`

---

### Step 2: Integrating Redis Pub/Sub Broadcasts

Next, we update the application to initialize Redis and run a background task that listens for incoming Redis events.

We use the asynchronous \`redis-py\` client library to handle non-blocking connection pools.

\`\`\`python
# filepath: src/main.py
import asyncio
import json
import logging
import redis.asyncio as aioredis
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from ws.manager import ConnectionManager

app = FastAPI(title="Distributed WebSockets Backend")
manager = ConnectionManager()

REDIS_URL = "redis://localhost:6379/0"
# Shared Redis connection reference
redis_client: aioredis.Redis | None = None

async def redis_listener(redis_inst: aioredis.Redis, conn_manager: ConnectionManager) -> None:
    '''
    Subscribes to the Redis broadcast channel and listens for events,
    forwarding them to all locally connected clients.
    '''
    pubsub = redis_inst.pubsub()
    await pubsub.subscribe("ws_broadcast")
    
    try:
        while True:
            # Poll for new messages without blocking the thread
            message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
            if message:
                raw_data = message["data"]
                if isinstance(raw_data, bytes):
                    payload_str = raw_data.decode("utf-8")
                    # Forward the broadcast message to all users on this server node
                    await conn_manager.broadcast_to_local_connections(payload_str)
            
            # Yield control back to the event loop
            await asyncio.sleep(0.01)
    except asyncio.CancelledError:
        logging.info("Redis subscription listener has stopped.")
    except Exception as exc:
        logging.error(f"Redis listener error: {str(exc)}")
    finally:
        await pubsub.unsubscribe("ws_broadcast")
        await pubsub.close()

@app.on_event("startup")
async def startup_event() -> None:
    global redis_client
    # Establish a persistent connection pool to Redis
    redis_client = aioredis.from_url(REDIS_URL, encoding="utf-8", decode_responses=True)
    # Run the Redis listener in the background
    asyncio.create_task(redis_listener(redis_client, manager))

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str) -> None:
    await manager.connect(user_id, websocket)
    try:
        while True:
            # Wait for incoming messages from the client
            client_input = await websocket.receive_text()
            
            # Broadcast the message to all servers via the Redis channel
            if redis_client:
                broadcast_payload = json.dumps({
                    "sender": user_id,
                    "text": client_input
                })
                await redis_client.publish("ws_broadcast", broadcast_payload)
                
    except WebSocketDisconnect:
        manager.disconnect(user_id)
        logging.info(f"Client {user_id} disconnected.")
\`\`\`

---

### Technical Deep Dive: Heartbeats, Recovery & Scalability

#### 1. Keep-Alive Heartbeats (Ping/Pong)
Load balancers and reverse proxies (like Nginx or AWS Application Load Balancers) terminate idle TCP connections after a timeout period (typically 60 seconds). To keep WebSocket connections active, implement a heartbeat ping-pong mechanism:

\`\`\`python
async def local_heartbeat_loop(websocket: WebSocket) -> None:
    try:
        while True:
            await asyncio.sleep(30)
            # Send a ping frame to verify the connection is active
            await websocket.send_json({"type": "ping"})
    except Exception:
        # A failed ping indicates the connection was lost
        pass
\`\`\`

#### 2. Reconnection Recovery States
If a user's connection drops due to a network change (e.g., switching from Wi-Fi to cellular data), the client-side application must reconnect.
- **Incremental Sequence IDs**: Assign sequential IDs to all broadcast events.
- **Client Message Buffering**: When reconnecting, the client should send its last received message ID to the backend:
  \`\`\`javascript
  // Client connection request query
  const socket = new WebSocket("wss://api.example.com/ws/user123?lastEventId=1045");
  \`\`\`
- **Replay Buffering**: The server can read missed events from a Redis Stream and send them to the client to ensure no data is lost.

#### 3. Redis Pub/Sub vs. Redis Streams
While Redis Pub/Sub is efficient, it uses a **fire-and-forget** delivery model. If a server instance crashes or disconnects from Redis, any messages sent during the downtime are lost.
- **Use Redis Pub/Sub** for real-time notifications or chat applications where message loss during server restarts is acceptable.
- **Use Redis Streams** for critical state synchronization. Redis Streams persist messages on disk, supporting consumer group offsets and message replays.

---

### Cross-Reading Recommendations

For details on optimizing the asynchronous backend or creating frontend components to display real-time updates, explore these articles:
* **[Taming Asyncio: Handling 10k+ Concurrent LLM Requests with Tornado & FastAPI](/?blog=taming-asyncio-tornado-fastapi-concurrency)**: Learn how to manage Python's event loop to prevent blocking during connection spikes.
* **[The CSS Glassmorphism Handbook: Coding Premium Futuristic Neon UI Layouts](/?blog=css-glassmorphism-handbook-neon-ui-layouts)**: Learn how to build real-time visual notifications and alerts inside glassmorphic dashboard panels.

---

### References & Official Documentation
* WebSockets Standard: **[FastAPI WebSockets Class Reference](https://fastapi.tiangolo.com/advanced/websockets/)**
* Pub/Sub System: **[Redis Pub/Sub Documentation](https://redis.io/docs/manual/pubsub/)**
* Python Client: **[Redis-Py Async Client API Docs](https://redis-py.readthedocs.io/)**

---

### Feedback & Collaboration

Scaling persistent socket connections requires coordinating network protocols and event buses. What tools do you use to test WebSocket connection loads? Have you deployed Redis clustering configurations in production?

I would love to learn about your architectural approaches. Share your thoughts on my [Resume Portal](https://samadshaikh.me) or write a note on my [Portfolio Portal's](https://samadshaikh.dev) Connect tab.
`
};
