import { Role } from '@prisma/client';
import { Request } from 'express';

interface UserRequest extends Request {
  headers: {
    authorization?: string;
  };
  user?: {
    id: number;
    email: string;
    role: Role;
    name: string;
  } | null;
}

export default UserRequest;
