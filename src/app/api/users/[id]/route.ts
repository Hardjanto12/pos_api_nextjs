import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [params.id]);
    connection.end();
    if ((rows as any).length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ user: (rows as any)[0] });
  } catch (error) {
    console.error('Error fetching user by id:', error);
    return NextResponse.json({ message: 'Error fetching user by id' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const connection = await getConnection();
    const body = await request.json();
    const { username, password, role } = body;

    const [result] = await connection.execute(
      'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?',
      [username, password, role, params.id]
    );
    connection.end();
    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [params.id]);
    connection.end();
    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
  }
}
