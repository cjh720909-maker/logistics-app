import { PrismaClient as PrismaClientAuth } from './generated/auth';
import { PrismaClient as PrismaClientLogistics } from './generated/logistics';
import path from 'path';

// 글로벌 네임스페이스에 인스턴스 저장
const globalForPrisma = global as unknown as {
    authDb: PrismaClientAuth;
    logisticsDb: PrismaClientLogistics;
};

// 환경에 따른 Auth DB URL 설정
const isProduction = process.env.VERCEL === '1' || !!process.env.POSTGRES_PRISMA_URL;

// 로컬에서는 SQLite 상대 경로 사용 (한글 경로/공백 등 경로 인식 문제 방지)
const authDbUrl = isProduction ? process.env.POSTGRES_PRISMA_URL : `file:./prisma/auth/auth.db`;

if (!isProduction) {
    process.env.AUTH_DATABASE_URL = authDbUrl;
    // 개발 환경에서는 캐시된 인스턴스를 무효화하여 최신 설정을 반영함
    if (globalForPrisma.authDb) {
        (globalForPrisma as any).authDb = undefined;
    }
}

console.log(`[DB Init] Auth DB 모드: ${isProduction ? 'PostgreSQL (Neon)' : 'SQLite (Local)'}`);
if (!isProduction) {
    console.log('[DB Init] Auth DB URL:', process.env.AUTH_DATABASE_URL);
}

export const authDb =
    (!isProduction ? undefined : globalForPrisma.authDb) ||
    new PrismaClientAuth({
        log: ['error', 'warn'],
    });

export const logisticsDb =
    globalForPrisma.logisticsDb ||
    new PrismaClientLogistics({
        datasourceUrl: process.env.MYSQL_DATABASE_URL,
        log: ['error', 'warn'],
    });

// 최신 모델 반영을 위해 개발 환경에서 인스턴스 갱신 시 로그 출력
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.authDb = authDb;
    globalForPrisma.logisticsDb = logisticsDb;
}

// 모델 로딩 확인용 (디버깅)
console.log('[DB Init] Auth Models:', Object.keys(authDb).filter(k => !k.startsWith('_')));
