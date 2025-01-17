import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET(req) {
    const url = req.url;
    const urlParams = new URLSearchParams(url.split('?')[1]); 
    const userId = urlParams.get('userId');
    console.log('recordUser:',userId)

    if (userId == null) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }


    try {
      const [presents] = await db.query(
        `SELECT * FROM attendance WHERE user_id = ? AND status = 'approved' ORDER BY date DESC`,
        [userId]
      );
      const [late] = await db.query(
        `SELECT * FROM attendance WHERE user_id = ? AND status = 'late' ORDER BY date DESC`,
        [userId]
      );
      const [leaves] = await db.query(
        'SELECT * FROM leave_requests WHERE user_id = ? ORDER BY start_date DESC',
        [userId]
      );
      const [monthlyWorkingDays] = await db.query('SELECT * FROM monthly_workingdays');
      const [workingDays] = await db.query('SELECT date FROM working_days');

      return NextResponse.json({ presents, leaves, monthlyWorkingDays, workingDays, late }, { status: 200 });
    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: 'Unable to fetch attendance records.' }, { status: 500 });
    }
}
