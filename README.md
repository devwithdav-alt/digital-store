Local: npm install, copy .env.example to .env.local, npm run dev
Database order in Supabase SQL editor: schema.sql, seed.sql, migration-001.sql, migration-002.sql
Never commit .env.local. SUPABASE_SERVICE_ROLE_KEY and PAYSTACK_SECRET_KEY are server secrets.
