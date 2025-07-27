import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const connection = await getConnection();

    let query = `
      SELECT
        p.id,
        p.name,
        SUM(ti.quantity) as total_quantity_sold,
        SUM(ti.subtotal) as total_revenue
      FROM
        transaction_items ti
      JOIN
        products p ON ti.product_id = p.id
      JOIN
        transactions t ON ti.transaction_id = t.id
      WHERE 1=1
    `;
    const params: (string | number)[] = [];

    if (userId) {
      query += ' AND t.user_id = ?';
      params.push(userId);
    }

    query += `
      GROUP BY
        p.id, p.name
      ORDER BY
        total_quantity_sold DESC
      LIMIT 10
    `;

    const [rows] = await connection.execute(query, params);
    connection.end();
    return NextResponse.json({ products: rows });
  } catch (error) {
    console.error('Error fetching top selling products:', error);
    return NextResponse.json({ message: 'Error fetching top selling products' }, { status: 500 });
  }
}
