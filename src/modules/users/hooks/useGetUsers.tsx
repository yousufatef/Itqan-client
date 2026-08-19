import { useQuery } from '@tanstack/react-query';
import useTableSearchParam from '@/hooks/useTableSearchParam';
import type { IUser } from '../types';

export const USERS_QUERY_KEY = ['users'];

const dummyUsers: IUser[] = [
  {
    id: '1',
    username: 'أحمد حسن',
    email: 'أحمد.حسن@example.com',
    phone: '+201001234567',
    role: 'admin',
    isActive: true,
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: '2',
    username: 'سارة علي',
    email: 'سارة.علي@example.com',
    phone: '+201112345678',
    role: 'teacher',
    isActive: true,
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
  },
  {
    id: '3',
    username: 'محمد سامي',
    email: 'محمد.سامي@example.com',
    phone: '+201223456789',
    role: 'parent',
    isActive: false,
    createdAt: '2026-02-18T10:00:00.000Z',
    updatedAt: '2026-02-18T10:00:00.000Z',
  },
];

export default function useGetUsers() {
  const { searchValue, getTableSearchParam } = useTableSearchParam();
  const selectedRole = getTableSearchParam('role');
  const role = selectedRole === 'all' ? '' : selectedRole;

  return useQuery({
    queryKey: [...USERS_QUERY_KEY, searchValue, role],
    queryFn: async () => ({
      result: {
        data: dummyUsers.filter((user) => {
          const normalizedSearch = searchValue.trim().toLowerCase();
          const matchesSearch = normalizedSearch
            ? [user.username, user.email, user.phone].some((value) =>
              value.toLowerCase().includes(normalizedSearch),
            )
            : true;
          const matchesRole = role ? user.role === role : true;

          return matchesSearch && matchesRole;
        }),
        totalCount: dummyUsers.filter((user) => {
          const normalizedSearch = searchValue.trim().toLowerCase();
          const matchesSearch = normalizedSearch
            ? [user.username, user.email, user.phone].some((value) =>
              value.toLowerCase().includes(normalizedSearch),
            )
            : true;
          const matchesRole = role ? user.role === role : true;

          return matchesSearch && matchesRole;
        }).length,
      },
    }),
  });
}
