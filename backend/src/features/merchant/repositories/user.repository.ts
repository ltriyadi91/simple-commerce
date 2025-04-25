import { PrismaClient, Role } from '@prisma/client';

export class UserRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async findMerchantUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email, role: Role.ADMIN },
      select: {
        id: true,
        password: true,
        role: true
      },
    });
  }

  async findMerchantUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId, role: Role.ADMIN },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}
