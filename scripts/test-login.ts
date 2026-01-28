import { PrismaClient } from '../lib/generated/auth';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testLogin() {
    const username = 'admin';
    const testPassword = 'password1234';

    try {
        console.log(`--- [${username}] 로그인 테스트 시작 ---`);
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            console.error('❌ 오류: DB에서 admin 사용자를 찾을 수 없습니다.');
            return;
        }

        console.log('✅ DB에서 사용자를 찾았습니다.');

        const isMatch = await bcrypt.compare(testPassword, user.password);
        if (isMatch) {
            console.log('✅ 로그인이 가능합니다! (비밀번호 일치)');
        } else {
            console.error('❌ 오류: 비밀번호가 일치하지 않습니다.');
        }
    } catch (error) {
        console.error('❌ 테스트 중 오류 발생:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testLogin();
