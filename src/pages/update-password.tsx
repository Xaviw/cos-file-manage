import { UpdatePasswordForm } from '@/components/update-password-form';
import { Header } from '@/components/header';

export default function UpdatePassword() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center p-8 min-h-[calc(100vh-4rem)]">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
