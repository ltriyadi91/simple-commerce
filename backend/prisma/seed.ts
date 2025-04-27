import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Seed users
  const adminHashedPassword = await bcrypt.hash(process.env.SEEDER_ADMIN_PASSWORD ?? '', 10);
  const customerHashedPassword = await bcrypt.hash(process.env.SEEDER_CUSTOMER_PASSWORD ?? '', 10);
  await prisma.user.createMany({
    data: [
      { 
        name: 'adminUser', 
        email: process.env.SEEDER_ADMIN_USERNAME ?? '', 
        password: adminHashedPassword,
        role: 'ADMIN' 
      },
      {
        name: 'customerUser',
        email: process.env.SEEDER_CUSTOMER_USERNAME?? '',
        password: customerHashedPassword,
        role: 'CUSTOMER',
      },
    ],
  });

  // Seed products
  await prisma.product.createMany({
    data: [
      {
        title: 'Product 1',
        price: 150000,
        description: 'This is description for product 1',
        quantity: 0,
        discount: 20,
        sku: 'SKU-123-1',
      },
      {
        title: 'Product 2',
        price: 250000,
        description: 'This is description for product 2',
        quantity: 1,
        discount: 20,
        sku: 'SKU-123-2',
      },
      {
        title: 'Product 3',
        price: 250000,
        description: 'This is description for product 3',
        quantity: 2,
        discount: 20,
        sku: 'SKU-123-3',
      },
      {
        title: 'Product 4',
        price: 250000,
        description: 'This is description for product 4',
        quantity: 3,
        discount: 20,
        sku: 'SKU-123-4',
      },
      {
        title: 'Product 5',
        price: 250000,
        description: 'This is description for product 5',
        quantity: 4,
        discount: 20,
        sku: 'SKU-123-5',
      },
      {
        title: 'Product 6',
        price: 250000,
        description: 'This is description for product 6',
        quantity: 5,
        discount: 20,
        sku: 'SKU-123-6',
      },
      {
        title: 'Product 7',
        price: 250000,
        description: 'This is description for product 7',
        quantity: 5,
        discount: 20,
        sku: 'SKU-123-7',
      },
      {
        title: 'Product 8',
        price: 250000,
        description: 'This is description for product 8',
        quantity: 5,
        discount: 20,
        sku: 'SKU-123-8',
      },
      {
        title: 'Product 9',
        price: 250000,
        description: 'This is description for product 9',
        quantity: 5,
        discount: 20,
        sku: 'SKU-123-9',
      },
      {
        title: 'Product 10',
        price: 250000,
        description: 'This is description for product 10',
        quantity: 5,
        discount: 20,
        sku: 'SKU-123-10',
      },
    ],
  });

  console.log('Database seeded successfully');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
