import { PrismaClient, Role } from '@prisma/client';

export class UserRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async findCustomerUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email, role: Role.CUSTOMER },
      select: {
        id: true,
        password: true,
        role: true
      },
    });
  }

  async findUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async createUser(data: { email: string; password: string; name: string, role: Role }) {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        role: true
      },
    });
  }
}
