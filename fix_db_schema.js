
const { PrismaClient } = require('./lib/generated/auth');
const prisma = new PrismaClient();

async function main() {
    try {
        const tableInfo = await prisma.$queryRawUnsafe(`PRAGMA table_info(User);`);
        console.log('User table columns fetched.');

        const roleExists = tableInfo.some(col => col.name === 'role');
        if (!roleExists) {
            console.log('Adding role column...');
            await prisma.$executeRawUnsafe(`ALTER TABLE User ADD COLUMN role TEXT DEFAULT 'customer';`);
            console.log('Role column added successfully.');
        } else {
            console.log('Role column already exists.');
        }

        const companyNameExists = tableInfo.some(col => col.name === 'companyName');
        if (!companyNameExists) {
            console.log('Adding companyName column...');
            await prisma.$executeRawUnsafe(`ALTER TABLE User ADD COLUMN companyName TEXT;`);
            console.log('CompanyName column added successfully.');
        } else {
            console.log('CompanyName column already exists.');
        }
    } catch (error) {
        console.error('Error during schema fix:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
