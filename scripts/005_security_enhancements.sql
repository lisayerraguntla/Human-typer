-- Add security-related tables and functions

-- Create login attempts tracking table
create table if not exists public.login_attempts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  ip_address inet,
  user_agent text,
  success boolean not null default false,
  attempted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.login_attempts enable row level security;

-- Create policy for login attempts (only allow system to insert)
create policy "login_attempts_insert_system"
  on public.login_attempts for insert
  with check (true);

-- Create index for faster lookups
create index if not exists login_attempts_email_idx on public.login_attempts(email);
create index if not exists login_attempts_ip_idx on public.login_attempts(ip_address);
create index if not exists login_attempts_attempted_at_idx on public.login_attempts(attempted_at);

-- Create two-factor authentication table
create table if not exists public.user_mfa (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  secret text not null,
  backup_codes text[] not null default '{}',
  enabled boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_mfa enable row level security;

-- RLS policies for MFA
create policy "user_mfa_select_own"
  on public.user_mfa for select
  using (auth.uid() = user_id);

create policy "user_mfa_insert_own"
  on public.user_mfa for insert
  with check (auth.uid() = user_id);

create policy "user_mfa_update_own"
  on public.user_mfa for update
  using (auth.uid() = user_id);

create policy "user_mfa_delete_own"
  on public.user_mfa for delete
  using (auth.uid() = user_id);

-- Create unique index
create unique index if not exists user_mfa_user_id_idx on public.user_mfa(user_id);

-- Function to log login attempts
create or replace function public.log_login_attempt(
  email_param text,
  ip_address_param inet default null,
  user_agent_param text default null,
  success_param boolean default false
)
returns uuid
language plpgsql
security definer
as $$
declare
  attempt_id uuid;
begin
  insert into public.login_attempts (email, ip_address, user_agent, success)
  values (email_param, ip_address_param, user_agent_param, success_param)
  returning id into attempt_id;
  
  return attempt_id;
end;
$$;

-- Function to check if IP is rate limited
create or replace function public.is_ip_rate_limited(
  ip_address_param inet,
  max_attempts integer default 5,
  window_minutes integer default 15
)
returns boolean
language plpgsql
security definer
as $$
declare
  attempt_count integer;
begin
  select count(*)
  into attempt_count
  from public.login_attempts
  where ip_address = ip_address_param
    and success = false
    and attempted_at > (now() - interval '1 minute' * window_minutes);
  
  return attempt_count >= max_attempts;
end;
$$;

-- Function to clean old login attempts (run periodically)
create or replace function public.cleanup_old_login_attempts()
returns void
language plpgsql
security definer
as $$
begin
  delete from public.login_attempts
  where attempted_at < (now() - interval '30 days');
end;
$$;
