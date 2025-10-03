-- Create companies table as the top-level entity
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Add company_id to clients table (tenants belong to companies)
ALTER TABLE public.clients ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX idx_clients_company_id ON public.clients(company_id);

-- Create app_role enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('super_admin', 'soc_admin', 'client_user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add company_id and role to profiles
ALTER TABLE public.profiles ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.profiles ADD COLUMN role public.app_role DEFAULT 'client_user';

-- Create indexes for better performance
CREATE INDEX idx_profiles_company_id ON public.profiles(company_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Create function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.user_has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Create function to get user's company_id
CREATE OR REPLACE FUNCTION public.get_user_company_id(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id
  FROM public.profiles
  WHERE user_id = _user_id
  LIMIT 1;
$$;

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION public.user_is_super_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_has_role(_user_id, 'super_admin');
$$;

-- Create function to check if user is soc admin or higher
CREATE OR REPLACE FUNCTION public.user_is_soc_admin_or_higher(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role IN ('super_admin', 'soc_admin')
  FROM public.profiles
  WHERE user_id = _user_id
  LIMIT 1;
$$;

-- RLS Policies for companies table
CREATE POLICY "Users can view their own company"
  ON public.companies FOR SELECT
  USING (id = get_user_company_id(auth.uid()));

CREATE POLICY "Super admins can manage their company"
  ON public.companies FOR ALL
  USING (id = get_user_company_id(auth.uid()) AND user_is_super_admin(auth.uid()));

-- RLS Policies for clients table (company data isolation)
DROP POLICY IF EXISTS "Allow all operations on clients" ON public.clients;

CREATE POLICY "Users can view clients from their company"
  ON public.clients FOR SELECT
  USING (company_id = get_user_company_id(auth.uid()));

CREATE POLICY "Super admins can manage clients in their company"
  ON public.clients FOR INSERT
  WITH CHECK (company_id = get_user_company_id(auth.uid()) AND user_is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update clients in their company"
  ON public.clients FOR UPDATE
  USING (company_id = get_user_company_id(auth.uid()) AND user_is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete clients in their company"
  ON public.clients FOR DELETE
  USING (company_id = get_user_company_id(auth.uid()) AND user_is_super_admin(auth.uid()));

-- RLS Policies for profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Super admins can view profiles in their company"
  ON public.profiles FOR SELECT
  USING (company_id = get_user_company_id(auth.uid()) AND user_is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage profiles in their company"
  ON public.profiles FOR ALL
  USING (company_id = get_user_company_id(auth.uid()) AND user_is_super_admin(auth.uid()));

-- RLS Policies for assets table (client data isolation)
DROP POLICY IF EXISTS "Allow all operations on assets" ON public.assets;

CREATE POLICY "Users can view assets from their company's clients"
  ON public.assets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = assets.client_id
        AND clients.company_id = get_user_company_id(auth.uid())
    )
  );

CREATE POLICY "SOC admins can manage assets in their company"
  ON public.assets FOR ALL
  USING (
    user_is_soc_admin_or_higher(auth.uid()) AND
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = assets.client_id
        AND clients.company_id = get_user_company_id(auth.uid())
    )
  );

-- RLS Policies for logs table (client data isolation)
DROP POLICY IF EXISTS "Allow all operations on logs" ON public.logs;

CREATE POLICY "Users can view logs from their company's clients"
  ON public.logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = logs.client_id
        AND clients.company_id = get_user_company_id(auth.uid())
    )
  );

CREATE POLICY "SOC admins can manage logs in their company"
  ON public.logs FOR ALL
  USING (
    user_is_soc_admin_or_higher(auth.uid()) AND
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = logs.client_id
        AND clients.company_id = get_user_company_id(auth.uid())
    )
  );

-- RLS Policies for knowledge_base table (client data isolation)
DROP POLICY IF EXISTS "Allow all operations on knowledge_base" ON public.knowledge_base;

CREATE POLICY "Users can view knowledge base from their company's clients"
  ON public.knowledge_base FOR SELECT
  USING (
    client_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = knowledge_base.client_id
        AND clients.company_id = get_user_company_id(auth.uid())
    )
  );

CREATE POLICY "SOC admins can manage knowledge base in their company"
  ON public.knowledge_base FOR ALL
  USING (
    user_is_soc_admin_or_higher(auth.uid()) AND
    (client_id IS NULL OR
     EXISTS (
       SELECT 1 FROM public.clients
       WHERE clients.id = knowledge_base.client_id
         AND clients.company_id = get_user_company_id(auth.uid())
     ))
  );

-- Update trigger for companies
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();