'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginAdmin, AdminAuthPayload, AdminProfile } from '@/lib/api/adminService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getAdminProfile } from '@/lib/api/adminService';

export default function AdminLoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation<AdminProfile, Error, AdminAuthPayload>({
    mutationFn: loginAdmin,
    onSuccess: async (admin) => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'me'] });
      toast.success(`Welcome back, ${admin.name}!`);
      router.replace('/admin/orders');
    },
    onError: (error: any) => {
      toast.error('Login failed', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    },
  });

  useEffect(() => {
    let cancelled = false;

    getAdminProfile()
      .then(() => {
        if (!cancelled) {
          router.replace('/admin/orders');
        }
      })
      .catch(() => {
        // user not logged in, ignore
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
