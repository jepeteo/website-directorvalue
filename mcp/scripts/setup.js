import { copyFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create prisma directory if it doesn't exist
const prismaDir = join(__dirname, '..', 'prisma');
try {
    mkdirSync(prismaDir, { recursive: true });
} catch (error) {
    // Directory might already exist
}

// Copy schema from parent project
const sourceSchema = join(__dirname, '..', '..', 'prisma', 'schema.prisma');
const targetSchema = join(prismaDir, 'schema.prisma');

try {
    copyFileSync(sourceSchema, targetSchema);
    console.log('✅ Prisma schema copied successfully');
} catch (error) {
    console.error('❌ Failed to copy Prisma schema:', error);
    process.exit(1);
}

console.log('🚀 Setup complete! Next steps:');
console.log('1. Edit .env with your DATABASE_URL');
console.log('2. Run: npm install');
console.log('3. Run: npx prisma generate');
console.log('4. Run: npm run dev');
