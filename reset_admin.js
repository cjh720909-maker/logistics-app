
const { PrismaClient } = require('./lib/generated/auth');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    try {
        const hashedPassword = await bcrypt.hash('admin', 10);
        // 새로운 스키마에는 데이터가 없으므로 upsert 사용
        const user = await prisma.user.upsert({
            where: { username: 'admin' },
            update: { password: hashedPassword },
            create: {
                username: 'admin',
                password: hashedPassword,
                role: 'staff',
                companyName: '관리자'
            }
        });
        console.log('Successfully created/updated admin account in isolated schema.');
        console.log(`User: ${user.username} (Role: ${user.role})`);
    } catch (error) {
        console.error('Error in isolated schema setup:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
