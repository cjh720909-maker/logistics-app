import { PrismaClient } from '../lib/generated/auth';

const prisma = new PrismaClient();

async function checkUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                companyName: true,
                createdAt: true
            }
        });

        console.log('--- 현재 등록된 사용자 목록 ---');
        if (users.length === 0) {
            console.log('등록된 사용자가 없습니다.');
        } else {
            console.table(users);
        }
    } catch (error) {
        console.error('조회 중 오류 발생:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
