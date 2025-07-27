import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const connection = await getConnection();

    let query = 'SELECT * FROM settings';
    let params: string[] = [];

    if (userId) {
      query += ' WHERE user_id = ?';
      params.push(userId);
    }

    const [rows] = await connection.execute(query, params);
    connection.end();
    return NextResponse.json({ settings: rows });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ message: 'Error fetching settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const connection = await getConnection();
    const body = await request.json();
    const { user_id, key, value } = body;

    const [existing] = await connection.execute(
      'SELECT * FROM settings WHERE user_id = ? AND `key` = ?',
      [user_id, key]
    );

    if ((existing as any).length > 0) {
      // Update existing setting
      await connection.execute(
        'UPDATE settings SET value = ? WHERE user_id = ? AND `key` = ?',
        [value, user_id, key]
      );
    } else {
      // Insert new setting
      await connection.execute(
        'INSERT INTO settings (user_id, `key`, value) VALUES (?, ?, ?)',
        [user_id, key, value]
      );
    }
    connection.end();
    return NextResponse.json({ message: 'Setting updated successfully' });
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json({ message: 'Error updating setting' }, { status: 500 });
  }
}
