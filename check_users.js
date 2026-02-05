
const { PrismaClient } = require('./lib/generated/auth');
const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany();
        console.log('--- Registered Users ---');
        users.forEach(u => {
            console.log(`Username: ${u.username}, Role: ${u.role}, Company: ${u.companyName}`);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
