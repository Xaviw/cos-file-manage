import { cn } from '@/lib/utils';
import { supabase } from '@/lib/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      location.href = '/';
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-8', className)} {...props}>
      <Card className="w-lg max-w-[90vw] shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-3xl font-bold text-center tracking-tight">登录</CardTitle>
          <CardDescription className="text-base text-center">
            请输入您的邮箱和密码登录账户
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email" className="text-sm font-medium">
                  邮箱
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    密码
                  </Label>
                  <a
                    href="/forgot-password"
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    忘记密码？
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
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
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </div>
            <div className="mt-6 text-center text-sm">
              还没有账户？{' '}
              <a
                href="/sign-up"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                立即注册
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
