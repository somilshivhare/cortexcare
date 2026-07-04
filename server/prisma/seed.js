import 'dotenv/config';
import prisma from '../src/config/prisma.js';
import { registerUser } from '../src/modules/auth/auth.service.js';

async function main() {
  console.log('Starting database seeding...');

  // 1. Delete existing data in reverse order of foreign key relationships
  console.log('Clearing existing database tables...');
  await prisma.clinicalContext.deleteMany();
  await prisma.conversationChunk.deleteMany();
  await prisma.doctorNote.deleteMany();
  await prisma.consultation.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleared all tables successfully.');

  // 2. Register patient John Doe
  console.log('Seeding Patient user...');
  const patientResult = await registerUser({
    email: 'patient@cortexcare.dev',
    password: 'Patient@123',
    role: 'PATIENT',
    firstName: 'John',
    lastName: 'Doe',
  });

  if (patientResult.success) {
    console.log(`Seeded Patient: ${patientResult.user.email} (ID: ${patientResult.user.id})`);
  } else {
    console.error('Failed to seed Patient user:', patientResult.error);
    throw new Error(patientResult.error);
  }

  // 3. Register doctor Sarah Wilson
  console.log('Seeding Doctor user...');
  const doctorResult = await registerUser({
    email: 'doctor@cortexcare.dev',
    password: 'Doctor@123',
    role: 'DOCTOR',
    firstName: 'Sarah',
    lastName: 'Wilson',
    specialty: 'Psychiatry',
  });

  if (doctorResult.success) {
    console.log(`Seeded Doctor: ${doctorResult.user.email} (ID: ${doctorResult.user.id})`);
  } else {
    console.error('Failed to seed Doctor user:', doctorResult.error);
    throw new Error(doctorResult.error);
  }

  console.log('Database seeding successfully finished.');
}

main()
  .catch((e) => {
    console.error('Database seeding crashed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
