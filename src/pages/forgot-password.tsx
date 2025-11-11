import { ForgotPasswordForm } from '@/components/forgot-password-form';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">COS 文件上传管理系统</h1>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
