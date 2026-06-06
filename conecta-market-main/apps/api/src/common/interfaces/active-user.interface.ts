import { UserRole } from '@prisma/client';

export interface ActiveUser {
  id: string;
  email: string;
  role: UserRole;
  storeId?: string;
  name: string;
  googleId?: string;
}
