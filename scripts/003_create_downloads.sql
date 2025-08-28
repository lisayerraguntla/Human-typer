-- Create downloads table to track extension download access
create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  download_url text not null,
  downloaded_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ip_address inet,
  user_agent text
);

-- Enable RLS
alter table public.downloads enable row level security;

-- RLS policies for downloads
create policy "downloads_select_own"
  on public.downloads for select
  using (auth.uid() = user_id);

create policy "downloads_insert_own"
  on public.downloads for insert
  with check (auth.uid() = user_id);

-- Create index for faster lookups
create index if not exists downloads_user_id_idx on public.downloads(user_id);
create index if not exists downloads_downloaded_at_idx on public.downloads(downloaded_at);
