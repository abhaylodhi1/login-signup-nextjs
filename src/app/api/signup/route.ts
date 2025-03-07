import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      mobile_no,
      password,
      gender,
      zipcode,
      city,
      country,
      state,
      address,
      country_code,
    } = await req.json();

    if (
      !name ||
      !email ||
      !mobile_no ||
      !password ||
      !gender ||
      !zipcode ||
      !city ||
      !country ||
      !state ||
      !address ||
      !country_code
    ) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 },
      );
    }

    // Check if user already exists
    const [existingUser] = await db.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email],
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: 'Email already in use' },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await db.query(
      `INSERT INTO users (name, email, mobile_no, password, gender, zipcode, city, country, state, address, country_code, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        name,
        email,
        mobile_no,
        hashedPassword,
        gender,
        zipcode,
        city,
        country,
        state,
        address,
        country_code,
      ],
    );

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 },
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
