import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const connection = await getConnection();

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    let totalRevenueQuery = 'SELECT SUM(total_amount) as totalRevenue FROM transactions WHERE DATE(transaction_date) = ?';
    let totalTransactionsQuery = 'SELECT COUNT(*) as totalTransactions FROM transactions WHERE DATE(transaction_date) = ?';
    let queryParams: (string | number)[] = [today];

    if (userId) {
      totalRevenueQuery += ' AND user_id = ?';
      totalTransactionsQuery += ' AND user_id = ?';
      queryParams.push(userId);
    }

    const [revenueRows] = await connection.execute(totalRevenueQuery, queryParams);
    const [transactionsRows] = await connection.execute(totalTransactionsQuery, queryParams);

    const totalRevenue = (revenueRows as any)[0].totalRevenue || 0.0;
    const totalTransactions = (transactionsRows as any)[0].totalTransactions || 0;
    const averageSaleValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0.0;

    connection.end();
    return NextResponse.json({
      totalRevenue,
      totalTransactions,
      averageSaleValue,
    });
  } catch (error) {
    console.error('Error fetching today summary:', error);
    return NextResponse.json({ message: 'Error fetching today summary' }, { status: 500 });
  }
}
