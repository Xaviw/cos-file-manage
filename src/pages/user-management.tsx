import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { DataTable } from '@/components/data-table';
import { UserActions } from '@/components/user-actions';
import { ColumnManager } from '@/components/column-manager';
import { User } from '@/types/user';
import { supabase } from '@/lib/client';
import { useUser } from '@/contexts/user-context';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';


export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useUser();

  const availableColumns = [
    { id: 'email', label: '邮箱' },
    { id: 'role', label: '角色' },
    { id: 'created_at', label: '注册时间' },
    { id: 'last_sign_in_at', label: '最后登录' },
    { id: 'is_banned', label: '状态' },
    { id: 'actions', label: '操作' },
  ];

  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'email',
    'role',
    'created_at',
    'is_banned',
    'actions',
  ]);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'email',
      header: '邮箱',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'role',
      header: '角色',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return (
          <Badge variant={role === 'admin' ? 'default' : 'secondary'}>
            {role === 'admin' ? '管理员' : '用户'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: '注册时间',
      cell: ({ row }) => {
        const date = new Date(row.getValue('created_at'));
        return <div>{date.toLocaleString('zh-CN')}</div>;
      },
    },
    {
      accessorKey: 'last_sign_in_at',
      header: '最后登录',
      cell: ({ row }) => {
        const date = row.getValue('last_sign_in_at') as string;
        return <div>{date ? new Date(date).toLocaleString('zh-CN') : '从未'}</div>;
      },
    },
    {
      accessorKey: 'is_banned',
      header: '状态',
      cell: ({ row }) => {
        const isBanned = row.getValue('is_banned') as boolean;
        return (
          <Badge variant={isBanned ? 'destructive' : 'default'}>
            {isBanned ? '已禁用' : '正常'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <UserActions
          user={row.original}
          onToggleBan={handleToggleBan}
          onPromote={handlePromote}
          isCurrentUserAdmin={isAdmin}
        />
      ),
    },
  ];

  useEffect(() => {
    if (!isAdmin) {
      return;
    }
    fetchUsers();
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('get-users');

      if (error) throw error;

      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (userId: string, ban: boolean) => {
    try {
      const { error } = await supabase.functions.invoke('update-user', {
        body: {
          userId,
          banned: ban,
          bannedUntil: ban ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null,
        },
      });

      if (error) throw error;

      // 更新本地状态
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, is_banned: ban, banned_until: ban ? new Date().toISOString() : undefined }
            : user
        )
      );
    } catch (error) {
      console.error('Error toggling user ban:', error);
    }
  };

  const handlePromote = async (userId: string, role: 'admin' | 'user') => {
    try {
      const { error } = await supabase.functions.invoke('update-user', {
        body: { userId, role },
      });

      if (error) throw error;

      // 更新本地状态
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role } : user
        )
      );
    } catch (error) {
      console.error('Error promoting user:', error);
    }
  };

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">
              <p className="text-gray-500 text-lg">您没有权限访问此页面</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
          </div>

          <div className="space-y-4">
            <div>
              <ColumnManager
                columns={availableColumns}
                visibleColumns={visibleColumns}
                onColumnToggle={handleColumnToggle}
              />
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">加载中...</p>
              </div>
            ) : (
              <DataTable
                columns={columns.filter((col) =>
                  visibleColumns.includes(col.accessorKey as string)
                )}
                data={users}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
