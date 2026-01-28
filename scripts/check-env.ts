const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
    console.log('.env 파일을 찾을 수 없습니다.');
    process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf8');
const lines = content.split('\n');

const vars = ['POSTGRES_PRISMA_URL', 'POSTGRES_URL_NON_POOLING', 'MYSQL_DATABASE_URL'];

lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || !trimmed.includes('=')) return;

    const [key, ...rest] = trimmed.split('=');
    const cleanKey = key.trim();

    if (vars.includes(cleanKey)) {
        let val = rest.join('=').trim();
        // 앞뒤 따옴표 제거
        if (val.startsWith('"') && val.endsWith('"')) val = val.substring(1, val.length - 1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.substring(1, val.length - 1);

        const scheme = val.split(':')[0];
        console.log(`${cleanKey}: 발견됨 (프로토콜: ${scheme})`);

        if (!['postgres', 'postgresql', 'mysql'].includes(scheme)) {
            console.log(`  ㄴ [주의] 프로토콜 형식이 올바르지 않은 것 같습니다: "${scheme}"`);
            console.log(`  ㄴ 값의 시작 부분 (~15자): "${val.substring(0, 15)}"`);
        }
    }
});
