import { db } from "@vercel/postgres";

export async function GET() {
  const client = await db.connect(); // データベース接続

  try {
    // クエリの実行
    const data = await client.sql`
      SELECT invoices.amount, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666;
    `;

    // クエリ結果を JSON レスポンスとして返す
    return new Response(JSON.stringify(data.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // 型ガードでエラーの型をチェック
    if (error instanceof Error) {
      // Error オブジェクトとして処理
      console.error("Error executing query:", error.message);
      console.error("Error stack trace:", error.stack);

      // クライアントにエラーメッセージを返す
      return new Response(
        JSON.stringify({
          error: "Failed to execute query",
          details: error.message,
          stack: error.stack,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      // Unknown 型のエラー処理
      console.error("Unknown error occurred:", error);

      return new Response(
        JSON.stringify({
          error: "Unknown error occurred",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } finally {
    client.release(); // データベースクライアントを解放
  }
}