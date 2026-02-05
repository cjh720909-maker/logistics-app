
const { PrismaClient } = require('./lib/generated/auth');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('--- Checking Columns in User table ---');
        const columns = await prisma.$queryRawUnsafe(`PRAGMA table_info(User);`);
        columns.forEach(col => {
            console.log(`Column found: ${col.name} (type: ${col.type})`);
        });

        const roleCol = columns.find(c => c.name === 'role');
        if (!roleCol) {
            console.log('Role column NOT found. Adding it now...');
            await prisma.$executeRawUnsafe(`ALTER TABLE User ADD COLUMN role TEXT DEFAULT 'customer';`);
            console.log('Successfully added role column.');
        } else {
            console.log('Role column already exists.');
        }

        const companyNameCol = columns.find(c => c.name === 'companyName');
        if (!companyNameCol) {
            console.log('CompanyName column NOT found. Adding it now...');
            await prisma.$executeRawUnsafe(`ALTER TABLE User ADD COLUMN companyName TEXT;`);
            console.log('Successfully added companyName column.');
        } else {
            console.log('CompanyName column already exists.');
        }

    } catch (error) {
        console.error('CRITICAL ERROR:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
