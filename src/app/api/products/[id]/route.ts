import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const connection = await getConnection();

    let query = 'SELECT * FROM products WHERE id = ?';
    let queryParams: (string | number)[] = [params.id];

    if (userId) {
      query += ' AND user_id = ?';
      queryParams.push(userId);
    }

    const [rows] = await connection.execute(query, queryParams);
    connection.end();
    if ((rows as any).length === 0) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ product: (rows as any)[0] });
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return NextResponse.json({ message: 'Error fetching product by id' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const connection = await getConnection();
    const body = await request.json();
    const { name, description, price, stock_quantity, sku } = body;

    const [result] = await connection.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ?, sku = ? WHERE id = ?',
      [name, description, price, stock_quantity, sku, params.id]
    );
    connection.end();
    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ message: 'Error updating product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const connection = await getConnection();

    let query = 'DELETE FROM products WHERE id = ?';
    let queryParams: (string | number)[] = [params.id];

    if (userId) {
      query += ' AND user_id = ?';
      queryParams.push(userId);
    }

    const [result] = await connection.execute(query, queryParams);
    connection.end();
    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ message: 'Error deleting product' }, { status: 500 });
  }
}
