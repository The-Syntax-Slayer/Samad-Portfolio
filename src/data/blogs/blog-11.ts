import type { BlogPost } from "../blogs";

export const blog11: BlogPost = {
  id: "blog-11",
  title: "How I Built PriMaX Hub: Scaling a Multi-Module SaaS on Supabase Architecture",
  slug: "how-i-built-primax-hub-supabase-architecture",
  date: "March 8, 2026",
  readTime: "12 min read",
  excerpt: "Case study on scaling a 4-module SaaS with PostgreSQL Row-Level Security policies and real-time state synchronization.",
  category: "DevOps",
  tags: ["Supabase", "PostgreSQL", "React 19", "SaaS", "PriMaX Hub", "State Sync"],
  metaDescription: "SaaS architectural case study: scaling PriMaX Hub with PostgreSQL Row-Level Security (RLS), profiles database triggers, and real-time sockets.",
  metaKeywords: "Supabase database, PostgreSQL RLS policy, real-time database sync, multi-module SaaS architecture, React Supabase integration",
  content: `### Introduction

When you build a Software-as-a-Service (SaaS) application, the most critical security requirement is **data isolation**. Under no circumstances should User A be able to view, edit, or delete the records of User B. 

In traditional architectures, developers enforce data isolation in the application layer. Every single database query in your API code must include an explicit authorization check:
\`\`\`sql
-- Every endpoint must manually verify ownership
SELECT * FROM documents WHERE id = \$1 AND user_id = \$2;
\`\`\`

If you forget to include the user check in even one query or endpoint, you risk leaking sensitive customer data.

When designing the architecture for **PriMaX Hub**—a multi-module SaaS platform containing Career Strategy, Intelligent Finance, Productivity, and Fitness tracking modules—I wanted a robust security model. I chose to enforce data isolation at the database layer using **PostgreSQL Row-Level Security (RLS)** via **Supabase**.

RLS acts as an automatic firewall inside your database. Instead of relying on backend code to sanitize queries, RLS intercepts every database request and applies access rules based on the authenticated user\\'s session. This guide explains how to design a multi-tenant SaaS schema using Supabase RLS, synchronize profiles using PostgreSQL triggers, and implement real-time state updates in React 19.

---

### Supabase SaaS Architecture and Data Flow

In a Supabase-backed React application, client queries bypass a custom backend API and communicate directly with PostgreSQL. RLS ensures that requests are filtered automatically before returning data:

\`\`\`
[ React 19 Client UI ] ─────────────────> [ Supabase Client SDK ]
                                                   │
                                                   ▼
[ Returned Records ] <── [ Postgres RLS Engine ] <── [ Direct SQL Query ]
                          (Checks: auth.uid())
                                 │
                                 ├──> [ Insert Event ] ──> [ Auto-sync Profile Trigger ]
                                 │
                                 └──> [ Update Event ] ──> [ Real-time WebSockets Channel ]
                                                                     │
                                                                     ▼
                                                           [ Instant UI Update ]
\`\`\`

When a query is received, PostgreSQL extracts the user\\'s authentication token from the request header, resolves their user ID using \`auth.uid()\`, and filters the returned rows accordingly.

---

### Step 1: SQL Schema Design and Row-Level Security Policies

To set up your database, define the schema for your user profiles and module records, enable RLS, and write policies that restrict access to the owning user.

Below is the complete database migration SQL script to configure this security structure:

\`\`\`sql
-- filepath: supabase/migrations/schema.sql

-- 1. Create a profiles table linked to Supabase auth.users
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the user records table for our SaaS modules
CREATE TABLE public.user_records (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    module_name VARCHAR(50) NOT NULL,
    record_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add database indexes on key lookup columns for performance
CREATE INDEX IF NOT EXISTS idx_records_user_id ON public.user_records(user_id);
CREATE INDEX IF NOT EXISTS idx_records_module_name ON public.user_records(module_name);

-- 3. Enable Row-Level Security on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_records ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for Profiles
CREATE POLICY \"Allow users to read their own profiles\" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY \"Allow users to edit their own profiles\" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 5. Create RLS Policies for User Records
-- This policy ensures users can only read rows where their user_id matches auth.uid()
CREATE POLICY \"Allow users to select their own records\" 
ON public.user_records FOR SELECT 
USING (auth.uid() = user_id);

-- This policy ensures users can only insert rows where they are marked as the owner
CREATE POLICY \"Allow users to insert their own records\" 
ON public.user_records FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- This policy restricts updates to the owning user
CREATE POLICY \"Allow users to update their own records\" 
ON public.user_records FOR UPDATE 
USING (auth.uid() = user_id);

-- This policy restricts deletions to the owning user
CREATE POLICY \"Allow users to delete their own records\" 
ON public.user_records FOR DELETE 
USING (auth.uid() = user_id);
\`\`\`

---

### Step 2: Database Triggers for Profile Management

When a user signs up using Supabase Auth, they are registered inside the internal \`auth.users\` table. However, our application code queries the \`public.profiles\` table, which contains user-specific fields like usernames and full names.

To keep these tables in sync, write a PostgreSQL function and trigger that automatically inserts a new profile row whenever a user signs up:

\`\`\`sql
-- filepath: supabase/migrations/trigger.sql

-- 1. Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS \$\$
BEGIN
  -- Insert a profile record using data from the auth signup metadata
  INSERT INTO public.profiles (id, username, full_name, updated_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>\'username\', \'user_\' || substring(new.id::text from 1 for 8)),
    new.raw_user_meta_data->>\'full_name\',
    now()
  );
  RETURN new;
END;
\$\$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Bind the function to the auth.users table
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
\`\`\`

> [!NOTE]
> The \`SECURITY DEFINER\` tag instructs PostgreSQL to execute the function with the permissions of the database administrator. This allows the function to insert rows into the \`public.profiles\` table even though the newly registered user has not authenticated yet.

---

### Step 3: Real-Time State Synchronization in React 19

With RLS handling security, your React application can subscribe to database changes directly. If a user modifies their finance or productivity data on another device, the UI updates instantly.

Below is a custom React hook that fetches initial records and subscribes to real-time changes, updating state automatically:

\`\`\`typescript
// filepath: src/hooks/useRealtimeData.ts
import { useEffect, useState } from \"react\";
import { createClient } from \"@supabase/supabase-js\";

// Initialize Supabase Client
const supabaseUrl = \"https://your-project.supabase.co\";
const supabaseAnonKey = \"your-anon-public-key\";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useRealtimeData(userId: string, targetModule: string) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;

    // 1. Fetch initial records matching module and user
    const fetchInitialData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from(\"user_records\")
        .select(\"*\")
        .eq(\"user_id\", userId)
        .eq(\"module_name\", targetModule)
        .order(\"created_at\", { ascending: false });

      if (error) {
        console.error(\"Error fetching initial records:\", error.message);
      } else if (data) {
        setRecords(data);
      }
      setLoading(false);
    };

    fetchInitialData();

    // 2. Subscribe to real-time changes filtered by user ID
    // PostgreSQL checks the RLS policies before broadcasting updates
    const channel = supabase
      .channel(\`realtime-sync-\${targetModule}\`)
      .on(
        \"postgres_changes\",
        { 
          event: \"*\", 
          schema: \"public\", 
          table: \"user_records\", 
          filter: \`user_id=eq.\${userId}\` 
        },
        (payload) => {
          if (payload.eventType === \"INSERT\") {
            setRecords((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === \"UPDATE\") {
            setRecords((prev) =>
              prev.map((item) => (item.id === payload.new.id ? payload.new : item))
            );
          } else if (payload.eventType === \"DELETE\") {
            setRecords((prev) => prev.filter((item) => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // 3. Clean up subscription when hook unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, targetModule]);

  return { records, loading };
}
\`\`\`

---

### Database Security Hardening Guidelines

1. **Never Disable RLS**: It is easy to disable RLS during debugging, but leaving it disabled exposes your tables to unauthorized queries. Ensure RLS is active on every table in production.
2. **Prevent Search Path Hijacking**: When writing PostgreSQL triggers with the \`SECURITY DEFINER\` tag, set an explicit search path to prevent attackers from hijacking database schemas:
   \`\`\`sql
   ALTER FUNCTION public.handle_new_user() SET search_path = public;
   \`\`\`
3. **Use UUIDs for Keys**: Avoid using auto-incrementing integer IDs for public-facing assets. Use UUIDs to prevent attackers from using sequential scan attacks to guess records.

---

### Reading Recommendations

To secure your API gateway and handle token rotation before routing requests to your database, read **[Zero-Trust API Authentication: Mitigating Token Leakage & Session Hijacking](/?blog=zero-trust-authentication-jwt-security-best-practices)**.

If you are containerizing microservices for cloud deployment, check out **[Minimized Docker Containerization: Deploying High-Performance Backends on AWS](/?blog=multi-stage-docker-builds-minimized-aws-lambda)**.

---

### References & Resources

* Supabase: **[Row-Level Security (RLS) Guide](https://supabase.com/docs/guides/database/postgres/row-level-security)**
* PostgreSQL: **[Trigger Procedure Documentation](https://www.postgresql.org/docs/current/plpgsql-trigger.html)**
* React: **[Supabase Realtime Channel Reference](https://supabase.com/docs/guides/realtime/concepts)**
* OWASP: **[Multi-Tenant Database Security Guidelines](https://cheatsheetseries.owasp.org/cheatsheets/Multitenancy_Cheat_Sheet.html)**

---

### Feedback & Collaboration

What backend configurations do you use to scale your SaaS products? Have you worked with Postgres triggers for user syncs? I\\'d love to hear your approaches! Leave your feedback on my **[Resume Portal](https://samadshaikh.me)** or write a note in the Connect tab.`
};
