import { db } from "@vercel/postgres";

// データベースクエリ関数
async function listInvoices() {
  const client = await db.connect();

  try {
    // クエリを実行
    const result = await client.sql`
      SELECT invoices.amount, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666;
    `;

    console.log("Query executed successfully:", result.rows); // クエリ結果をログに記録
    return result.rows; // クエリ結果を返す
  } catch (error) {
    console.error("Query execution error:", error); // エラー詳細をログに記録
    throw new Error("Failed to execute query");
  } finally {
    client.release(); // クライアントを解放
  }
}

// GETハンドラー
export async function GET() {
  try {
    // データベースからデータを取得
    const data = await listInvoices();

    // 正常なレスポンスを返す
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // 型ガードを使用してエラーメッセージを処理
    if (error instanceof Error) {
      console.error("Error in GET handler:", error.message); // エラーメッセージをログに記録
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      console.error("Unknown error occurred:", error); // 未知のエラーをログに記録
      return new Response(
        JSON.stringify({ error: "Unknown error occurred" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
