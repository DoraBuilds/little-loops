# Supabase Setup

## Environment Variables

Add these to your local environment before testing the parent account shell:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

You can start from [.env.example](../.env.example).

## What Works After Configuring Keys

- parent sign in
- parent sign up
- persisted Supabase session in the browser
- real household bootstrap in the app once the Supabase schema exists

## What Still Comes Next

Still required:
- applying the migration in `supabase/migrations/20260410194500_create_household_schema.sql` to the remote project
- making sure the migration includes the `bootstrap_household` RPC so the first owner membership can be created safely under RLS
- cloud-backed child/routine sync
- local-to-cloud import flow
