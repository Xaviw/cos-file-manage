import { useState, useRef } from 'react';
import { supabase } from '@/lib/client';
import { useUser } from '@/contexts/user-context';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const { user, isAdmin, isBanned } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setShowDropdown(false);
    try {
      await supabase.auth.signOut();
      location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleUpdatePassword = () => {
    setShowDropdown(false);
    location.href = '/update-password';
  };

  const handleLogoClick = () => {
    location.href = '/';
  };

  const handleUploadRecordsClick = () => {
    location.href = '/upload-records';
  };

  const handleUserManagementClick = () => {
    location.href = '/user-management';
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16">
          <h1
            className="text-xl font-bold text-gray-900 cursor-pointer hover:text-gray-700 absolute left-4"
            onClick={handleLogoClick}
          >
            COS文件上传管理系统
          </h1>

          {user && (
            <nav className="flex items-center space-x-8">
              <button
                type="button"
                onClick={handleUploadRecordsClick}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline underline-offset-4"
              >
                上传记录
              </button>
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleUserManagementClick}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline underline-offset-4"
                >
                  用户管理
                </button>
              )}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <div className="flex flex-col items-end">
                    <div className="flex space-x-1">
                      {isAdmin && (
                        <Badge variant="default" className="text-xs">
                          管理员
                        </Badge>
                      )}
                      {isBanned && (
                        <Badge variant="destructive" className="text-xs">
                          已禁用
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button
                      type="button"
                      onClick={handleUpdatePassword}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      修改密码
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
