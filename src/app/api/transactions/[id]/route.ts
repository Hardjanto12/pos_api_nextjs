import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const connection = await getConnection();

    let query = 'SELECT * FROM transactions WHERE id = ?';
    let queryParams: (string | number)[] = [params.id];

    if (userId) {
      query += ' AND user_id = ?';
      queryParams.push(userId);
    }

    const [rows] = await connection.execute(query, queryParams);
    connection.end();
    if ((rows as any).length === 0) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }
    return NextResponse.json({ transaction: (rows as any)[0] });
  } catch (error) {
    console.error('Error fetching transaction by id:', error);
    return NextResponse.json({ message: 'Error fetching transaction by id' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const connection = await getConnection();

    let query = 'DELETE FROM transactions WHERE id = ?';
    let queryParams: (string | number)[] = [params.id];

    if (userId) {
      query += ' AND user_id = ?';
      queryParams.push(userId);
    }

    const [result] = await connection.execute(query, queryParams);
    connection.end();
    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ message: 'Error deleting transaction' }, { status: 500 });
  }
}
