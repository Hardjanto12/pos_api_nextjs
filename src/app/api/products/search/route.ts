import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const query = searchParams.get('query');
    const connection = await getConnection();

    let sqlQuery = 'SELECT * FROM products WHERE 1=1';
    const params: string[] = [];

    if (userId) {
      sqlQuery += ' AND user_id = ?';
      params.push(userId);
    }

    if (query) {
      sqlQuery += ' AND (name LIKE ? OR description LIKE ? OR sku LIKE ?)';
      params.push(`%${query}%`);
      params.push(`%${query}%`);
      params.push(`%${query}%`);
    }

    const [rows] = await connection.execute(sqlQuery, params);
    connection.end();
    return NextResponse.json({ products: rows });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json({ message: 'Error searching products' }, { status: 500 });
  }
}
