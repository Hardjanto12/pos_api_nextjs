import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const connection = await getConnection();

    let query = 'SELECT * FROM products';
    let params: string[] = [];

    if (userId) {
      query += ' WHERE user_id = ?';
      params.push(userId);
    }

    const [rows] = await connection.execute(query, params);
    connection.end();
    return NextResponse.json({ products: rows });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const connection = await getConnection();
    const body = await request.json();
    const { id, name, description, price, stock_quantity, sku, user_id } = body;

    const [result] = await connection.execute(
      'INSERT INTO products (id, name, description, price, stock_quantity, sku, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, description, price, stock_quantity, sku, user_id]
    );
    connection.end();
    return NextResponse.json({ id: (result as any).insertId });
  } catch (error) {
    console.error('Error inserting product:', error);
    return NextResponse.json({ message: 'Error inserting product' }, { status: 500 });
  }
}
