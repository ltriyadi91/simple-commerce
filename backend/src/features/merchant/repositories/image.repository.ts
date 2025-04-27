import { PrismaClient, Image } from '@prisma/client';

export class ImageRepository {
  constructor(private prisma: PrismaClient) {}
  async createImage(data: Omit<Image, 'id' | 'createdAt' | 'updatedAt'>): Promise<Image> {
    return this.prisma.image.create({
      data,
    });
  }

  async getImageById(id: number): Promise<Image | null> {
    return this.prisma.image.findUnique({
      where: { id },
    });
  }

  async getImagesByProductId(productId: number): Promise<Image[]> {
    return this.prisma.image.findMany({
      where: { productId },
    });
  }

  async updateImage(
    id: number,
    data: Partial<Omit<Image, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Image> {
    return this.prisma.image.update({
      where: { id },
      data,
    });
  }

  async deleteImage(id: number): Promise<Image> {
    return this.prisma.image.delete({
      where: { id },
    });
  }
}
