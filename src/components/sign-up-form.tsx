import { cn } from '@/lib/utils';
import { supabase } from '@/lib/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== repeatPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-8', className)} {...props}>
      {success ? (
        <Card className="w-[32rem] max-w-[90vw] shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-3xl font-bold text-center tracking-tight">
              感谢您的注册！
            </CardTitle>
            <CardDescription className="text-base text-center">
              请检查您的邮箱以确认账户
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-base text-muted-foreground text-center">
              您已成功注册。请检查您的邮箱以确认账户，然后再登录。
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-[32rem] max-w-[90vw] shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-3xl font-bold text-center tracking-tight">注册</CardTitle>
            <CardDescription className="text-base text-center">创建新账户</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleSignUp}>
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
                  <Label htmlFor="password" className="text-sm font-medium">
                    密码
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="repeat-password" className="text-sm font-medium">
                    确认密码
                  </Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={e => setRepeatPassword(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? '注册中...' : '注册'}
                </Button>
              </div>
              <div className="mt-6 text-center text-sm">
                已有账户？{' '}
                <a
                  href="/login"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  立即登录
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
