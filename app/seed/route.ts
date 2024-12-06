import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
    try {
        // テーブル作成
        await sql`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255));`;

        // 初期データ挿入
        await sql`INSERT INTO users (name) VALUES ('Alice'), ('Bob'), ('Charlie');`;

        return new Response('データベースが正常にシードされました');
    } catch (error) {
        console.error('データベースエラー:', error);
        return new Response('データベースにエラーが発生しました', { status: 500 });
    }
}
