-- Function to check if user has active subscription
create or replace function public.has_active_subscription(user_uuid uuid)
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1 
    from public.subscriptions 
    where user_id = user_uuid 
    and status = 'active' 
    and current_period_end > now()
  );
end;
$$;

-- Function to get user subscription status
create or replace function public.get_subscription_status(user_uuid uuid)
returns table (
  status text,
  current_period_end timestamp with time zone,
  stripe_customer_id text
)
language plpgsql
security definer
as $$
begin
  return query
  select s.status, s.current_period_end, s.stripe_customer_id
  from public.subscriptions s
  where s.user_id = user_uuid
  order by s.created_at desc
  limit 1;
end;
$$;

-- Function to log download
create or replace function public.log_download(
  user_uuid uuid,
  download_url_param text,
  ip_address_param inet default null,
  user_agent_param text default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  download_id uuid;
begin
  insert into public.downloads (user_id, download_url, ip_address, user_agent)
  values (user_uuid, download_url_param, ip_address_param, user_agent_param)
  returning id into download_id;
  
  return download_id;
end;
$$;
