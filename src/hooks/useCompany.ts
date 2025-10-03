import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Company {
  id: string;
  name: string;
  email: string;
  settings: any;
  created_at: string;
  updated_at: string;
}

export function useCompany() {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchCompany();
    } else {
      setCompany(null);
      setLoading(false);
    }
  }, [user?.id]);

  const fetchCompany = async () => {
    if (!user?.id) return;

    try {
      // Get user's profile to find their company_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('user_id', user.id)
        .single();

      if (!profile?.company_id) {
        setCompany(null);
        setLoading(false);
        return;
      }

      // Fetch the company details
      const { data: companyData } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .single();

      setCompany(companyData);
    } catch (error) {
      console.error('Error fetching company:', error);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    company,
    loading,
    refetch: fetchCompany
  };
}
