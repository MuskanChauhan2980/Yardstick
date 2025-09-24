const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Hashed password for 'password'
  const hashedPassword = await bcrypt.hash('password', 10);

  // 1. Create Tenants
  const acmeTenant = await prisma.tenant.create({
    data: {
      slug: 'acme',
      plan: 'free'
    }
  });

  const globexTenant = await prisma.tenant.create({
    data: {
      slug: 'globex',
      plan: 'free'
    }
  });

  // 2. Create Users
  await prisma.user.createMany({
    data: [
      {
        email: 'admin@acme.test',
        password: hashedPassword,
        role: 'admin',
        tenantId: acmeTenant.id
      },
      {
        email: 'user@acme.test',
        password: hashedPassword,
        role: 'member',
        tenantId: acmeTenant.id
      },
      {
        email: 'admin@globex.test',
        password: hashedPassword,
        role: 'admin',
        tenantId: globexTenant.id
      },
      {
        email: 'user@globex.test',
        password: hashedPassword,
        role: 'member',
        tenantId: globexTenant.id
      }
    ]
  });

  console.log('Database seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });