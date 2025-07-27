import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const connection = await getConnection();

    let query = 'SELECT * FROM users';
    let params: string[] = [];

    if (username) {
      query += ' WHERE username = ?';
      params.push(username);
    }

    const [rows] = await connection.execute(query, params);
    connection.end();
    return NextResponse.json({ users: rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const connection = await getConnection();
    const body = await request.json();
    const { id, username, password, role } = body;

    const [result] = await connection.execute(
      'INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)',
      [id, username, password, role]
    );
    connection.end();
    return NextResponse.json({ id: (result as any).insertId });
  } catch (error) {
    console.error('Error inserting user:', error);
    return NextResponse.json({ message: 'Error inserting user' }, { status: 500 });
  }
}
