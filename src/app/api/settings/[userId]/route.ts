import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT `key`, value FROM settings WHERE user_id = ?', [params.userId]);
    connection.end();
    return NextResponse.json({ settings: rows });
  } catch (error) {
    console.error('Error fetching settings by user id:', error);
    return NextResponse.json({ message: 'Error fetching settings by user id' }, { status: 500 });
  }
}
