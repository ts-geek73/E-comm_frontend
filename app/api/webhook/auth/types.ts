export interface UserData {
    email: string;
    provider: 'google' | 'github' | 'normal';
    name: string;
    clerkId: string;
    userId: string;
    password?: string;
  }