import { cn } from '@/lib/utils';
import { supabase } from '@/lib/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export function UpdatePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      // Sign out the user and redirect to login page
      await supabase.auth.signOut();
      location.href = '/login';
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-8', className)} {...props}>
      <Card className="w-[32rem] max-w-[90vw] shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-3xl font-bold text-center tracking-tight">重置密码</CardTitle>
          <CardDescription className="text-base text-center">请在下方输入新密码</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <form onSubmit={handleUpdatePassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="password" className="text-sm font-medium">
                  新密码
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="新密码"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                type="submit"
                className="w-full h-12 text-base font-medium mt-2"
                disabled={isLoading}
              >
                {isLoading ? '保存中...' : '保存新密码'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
