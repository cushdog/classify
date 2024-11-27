// app/api/professors/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  insertProfessor,
  getAllProfessors,
  getProfessorsByDepartment,
  getProfessorStatsByDepartment,
} from '@/db/Supabase Professor Reviews/operations';
import { IProfessorInsert } from '@/db/Supabase Professor Reviews/types';

// Handle GET requests (fetch professors or stats)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const department = searchParams.get('department');
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  try {
    if (department) {
      // If a department is specified, return stats and professors
      const { averages, total } = await getProfessorStatsByDepartment(department);
      const { professors } = await getProfessorsByDepartment(department, limit, offset);

      return NextResponse.json({ professors, averages, total });
    } else {
      // Otherwise, fetch all professors with pagination
      const { professors, total } = await getAllProfessors(limit, offset);

      return NextResponse.json({ professors, total });
    }
  } catch (error) {
    console.error('Error fetching professors:', error);
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
