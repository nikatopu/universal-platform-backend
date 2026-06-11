import { PrismaClient, Role, GymStatus } from '@prisma/client';
import { hash } from 'argon2';

/**
 * Development seed — creates demo data for local development only.
 * Never run this against a production database.
 *
 * Passwords are taken from env vars so they are not exposed in source code.
 * Set SEED_ADMIN_PASSWORD and SEED_MEMBER_PASSWORD in your .env before running.
 */
const prisma = new PrismaClient();

const SEED_COMPANY_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  console.log('Seeding development database...');

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@fitreserve.dev';
  const memberEmail = process.env.SEED_MEMBER_EMAIL ?? 'member@fitreserve.dev';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const memberPassword = process.env.SEED_MEMBER_PASSWORD;

  if (!adminPassword || !memberPassword) {
    console.error(
      'Error: SEED_ADMIN_PASSWORD and SEED_MEMBER_PASSWORD must be set in .env before seeding.',
    );
    process.exit(1);
  }

  const company = await prisma.company.upsert({
    where: { id: SEED_COMPANY_ID },
    update: {},
    create: {
      id: SEED_COMPANY_ID,
      project_id: 'fitreserve',
      name: 'FitReserve Studio',
      email: 'studio@fitreserve.dev',
      phone: '+1-555-0100',
    },
  });

  console.log(`Company: ${company.name}`);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password_hash: await hash(adminPassword),
      first_name: 'Admin',
      last_name: 'User',
      role: Role.ADMIN,
    },
  });

  console.log(`Admin: ${admin.email}`);

  const member = await prisma.user.upsert({
    where: { email: memberEmail },
    update: {},
    create: {
      email: memberEmail,
      password_hash: await hash(memberPassword),
      first_name: 'Jane',
      last_name: 'Doe',
      role: Role.MEMBER,
    },
  });

  console.log(`Member: ${member.email}`);

  await prisma.settings.upsert({
    where: { company_id: company.id },
    update: {},
    create: {
      company_id: company.id,
      gym_status: GymStatus.OPEN,
      announcement: 'Welcome to FitReserve! Book your first class today.',
    },
  });

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
