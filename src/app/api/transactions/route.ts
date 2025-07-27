import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const connection = await getConnection();

    let query = 'SELECT * FROM transactions';
    let params: string[] = [];

    if (userId) {
      query += ' WHERE user_id = ?';
      params.push(userId);
    }

    const [rows] = await connection.execute(query, params);
    connection.end();
    return NextResponse.json({ transactions: rows });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ message: 'Error fetching transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let connection;
  try {
    connection = await getConnection();
    await connection.beginTransaction();

    const body = await request.json();
    const { id, total_amount, total_items, transaction_date, user_id, items, use_inventory_tracking } = body;

    const [result] = await connection.execute(
      'INSERT INTO transactions (id, total_amount, total_items, transaction_date, user_id) VALUES (?, ?, ?, ?, ?)',
      [id, total_amount, total_items, transaction_date, user_id]
    );
    const transactionId = (result as any).insertId;

    for (const item of items) {
      await connection.execute(
        'INSERT INTO transaction_items (transaction_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)',
        [transactionId, item.product_id, item.quantity, item.price, item.subtotal]
      );

      if (use_inventory_tracking) {
        await connection.execute(
          'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }
    }

    await connection.commit();
    connection.end();
    return NextResponse.json({ id: transactionId });
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.end();
    }
    console.error('Error inserting transaction:', error);
    return NextResponse.json({ message: 'Error inserting transaction' }, { status: 500 });
  }
}
