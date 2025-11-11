export interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  role: 'admin' | 'user';
  is_banned: boolean;
  banned_until?: string;
}

export interface UserTableColumn {
  id: string;
  label: string;
  visible: boolean;
}
