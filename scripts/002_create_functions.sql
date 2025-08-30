-- Function to generate license keys
CREATE OR REPLACE FUNCTION generate_license_key()
RETURNS TEXT AS $$
BEGIN
  RETURN 'HT-' || upper(substring(gen_random_uuid()::text from 1 for 8)) || 
         '-' || upper(substring(gen_random_uuid()::text from 1 for 8)) ||
         '-' || upper(substring(gen_random_uuid()::text from 1 for 8));
END;
$$ LANGUAGE plpgsql;

-- Function to create license on subscription activation
CREATE OR REPLACE FUNCTION create_user_license()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create license for active subscriptions
  IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status != 'active') THEN
    INSERT INTO public.licenses (user_id, license_key)
    VALUES (NEW.user_id, generate_license_key())
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Grant entitlements
    INSERT INTO public.entitlements (user_id, feature_name)
    VALUES 
      (NEW.user_id, 'extension_download'),
      (NEW.user_id, 'premium_features')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Revoke license if subscription becomes inactive
  IF NEW.status != 'active' AND OLD.status = 'active' THEN
    UPDATE public.licenses 
    SET status = 'suspended', updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    -- Remove entitlements
    DELETE FROM public.entitlements 
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically manage licenses based on subscription status
DROP TRIGGER IF EXISTS on_subscription_change ON public.subscriptions;
CREATE TRIGGER on_subscription_change
  AFTER INSERT OR UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION create_user_license();

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    user_id, action, resource_type, resource_id, 
    details, ip_address, user_agent
  )
  VALUES (
    p_user_id, p_action, p_resource_type, p_resource_id,
    p_details, p_ip_address, p_user_agent
  )
  RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
