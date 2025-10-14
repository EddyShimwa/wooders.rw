'use client'

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getAdminProfile } from '@/lib/api/adminService';

export const useRequireAdmin = () => {
  const router = useRouter();

  const query = useQuery({
    queryKey: ['admin', 'me'],
    queryFn: getAdminProfile,
    retry: 0,
  });

  useEffect(() => {
    if (query.isError && !query.isFetching) {
      router.replace('/admin/login');
    }
  }, [query.isError, query.isFetching, router]);

  return query;
};
