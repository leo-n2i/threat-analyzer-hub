import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useRBAC } from '@/hooks/useRBAC';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

const createTenantSchema = z.object({
  name: z.string().min(1, 'Tenant name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
});

type CreateTenantFormData = z.infer<typeof createTenantSchema>;

interface CreateTenantDialogProps {
  onTenantCreated: () => void;
}

export function CreateTenantDialog({ onTenantCreated }: CreateTenantDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { userProfile } = useRBAC();

  const form = useForm<CreateTenantFormData>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = async (data: CreateTenantFormData) => {
    try {
      setLoading(true);

      if (!userProfile?.company_id) {
        toast({
          title: 'Error',
          description: 'You must be associated with a company to create tenants',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('clients')
        .insert({
          name: data.name,
          email: data.email,
          company_id: userProfile.company_id,
          settings: { status: 'active' },
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Tenant created successfully',
      });

      form.reset();
      setOpen(false);
      onTenantCreated();
    } catch (error) {
      console.error('Error creating tenant:', error);
      toast({
        title: 'Error',
        description: 'Failed to create tenant',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Tenant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Tenant</DialogTitle>
          <DialogDescription>
            Add a new tenant client to the system. Required fields are marked with *.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter tenant name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant Email *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="tenant@example.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Tenant'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
