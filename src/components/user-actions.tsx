import { Button } from '@/components/ui/button';
import { User } from '@/types/user';
import { Ban, UserCheck } from 'lucide-react';

interface UserActionsProps {
  user: User;
  onToggleBan: (userId: string, ban: boolean) => void;
  onPromote: (userId: string, role: 'admin' | 'user') => void;
  isCurrentUserAdmin: boolean;
}

export function UserActions({
  user,
  onToggleBan,
  onPromote,
  isCurrentUserAdmin,
}: UserActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={user.is_banned ? 'default' : 'destructive'}
        size="sm"
        onClick={() => onToggleBan(user.id, !user.is_banned)}
        disabled={!isCurrentUserAdmin}
      >
        {user.is_banned ? (
          <>
            <UserCheck className="w-4 h-4 mr-1" />
            启用
          </>
        ) : (
          <>
            <Ban className="w-4 h-4 mr-1" />
            禁用
          </>
        )}
      </Button>

      {user.role !== 'admin' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPromote(user.id, 'admin')}
          disabled={!isCurrentUserAdmin}
        >
          设为管理员
        </Button>
      )}
    </div>
  );
}
