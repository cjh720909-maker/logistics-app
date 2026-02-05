
const { PrismaClient } = require('./lib/generated/auth');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    try {
        const hashedPassword = await bcrypt.hash('admin', 10);
        const updatedUser = await prisma.user.update({
            where: { username: 'admin' },
            data: { password: hashedPassword }
        });
        console.log('Successfully updated admin password.');
        console.log(`Updated user: ${updatedUser.username} (Role: ${updatedUser.role})`);
    } catch (error) {
        console.error('Error updating admin password:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
