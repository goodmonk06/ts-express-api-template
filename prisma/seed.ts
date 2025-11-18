import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.user.deleteMany({});
  console.log('📦 Cleared existing users');

  // Create demo users
  const demoPassword = await bcrypt.hash('demo123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'demo@example.com',
        password: demoPassword,
        name: 'Demo User',
      },
    }),
    prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        password: demoPassword,
        name: 'John Doe',
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@example.com',
        password: demoPassword,
        name: 'Jane Smith',
      },
    }),
    prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: demoPassword,
        name: 'Admin User',
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} demo users:`);
  users.forEach((user) => {
    console.log(`  - ${user.email} (${user.name})`);
  });

  console.log('\n📝 Demo credentials:');
  console.log('  Email: demo@example.com');
  console.log('  Password: demo123');
  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
