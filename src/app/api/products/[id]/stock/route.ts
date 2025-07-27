import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const connection = await getConnection();
    const body = await request.json();
    const { stock_quantity, user_id, date_updated } = body;

    const [result] = await connection.execute(
      'UPDATE products SET stock_quantity = ?, user_id = ?, date_updated = ? WHERE id = ?',
      [stock_quantity, user_id, date_updated, params.id]
    );
    connection.end();
    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Stock quantity updated successfully' });
  } catch (error) {
    console.error('Error updating stock quantity:', error);
    return NextResponse.json({ message: 'Error updating stock quantity' }, { status: 500 });
  }
}
