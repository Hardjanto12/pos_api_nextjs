import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const connection = await getConnection();

    let query = 'SELECT ti.*, p.name as product_name FROM transaction_items ti JOIN products p ON ti.product_id = p.id WHERE ti.transaction_id = ?';
    let queryParams: (string | number)[] = [params.id];

    // Note: The Flutter app passes user_id for transaction items, but it's not directly used in the SQL query
    // for transaction_items table unless there's a user_id column in transaction_items or a join to transactions table.
    // Assuming user_id is for filtering transactions first, then their items.
    // If transaction_items also has user_id, add it to the query.

    const [rows] = await connection.execute(query, queryParams);
    connection.end();
    return NextResponse.json({ items: rows });
  } catch (error) {
    console.error('Error fetching transaction items:', error);
    return NextResponse.json({ message: 'Error fetching transaction items' }, { status: 500 });
  }
}
