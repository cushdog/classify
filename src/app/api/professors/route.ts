// app/api/professors/route.ts

import { NextRequest, NextResponse } from 'next/server';
import {
  getProfessorByName,
  insertProfessor,
} from '@/db/Supabase Professor Reviews/operations';
import { IProfessorInsert } from '@/db/Supabase Professor Reviews/types';

// Handle GET requests (fetch professor by name)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');

  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: 'First name and last name are required' },
      { status: 400 }
    );
  }

  try {
    const professor = await getProfessorByName(firstName, lastName);

    if (!professor) {
      return NextResponse.json(
        { error: 'Professor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(professor);
  } catch (error) {
    console.error('Error fetching professor:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle POST requests (insert a new professor)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const professorData: IProfessorInsert = body;

    // Validate required fields
    if (!professorData.firstName || !professorData.lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    const newProfessor = await insertProfessor(professorData);

    if (newProfessor) {
      return NextResponse.json(newProfessor, { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'Failed to insert professor' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Professor submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
