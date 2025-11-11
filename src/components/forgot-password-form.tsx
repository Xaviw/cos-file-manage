import { cn } from '@/lib/utils';
import { supabase } from '@/lib/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:5173/update-password',
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
              请检查您的邮箱
            </CardTitle>
            <CardDescription className="text-base text-center">密码重置邮件已发送</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-base text-muted-foreground text-center">
              如果您使用邮箱注册，您将收到一封密码重置邮件。
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-[32rem] max-w-[90vw] shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-3xl font-bold text-center tracking-tight">
              重置密码
            </CardTitle>
            <CardDescription className="text-base text-center">
              输入您的邮箱，我们将发送密码重置链接
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleForgotPassword}>
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
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? '发送中...' : '发送重置邮件'}
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
