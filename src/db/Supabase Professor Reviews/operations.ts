// db/operationsProfessors.ts

import { supabase } from '@/lib/supabaseClient';
import { IProfessor, IProfessorInsert } from './types';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

// Utility function to convert array of objects to camelCase
function mapArrayToCamelCase<T>(data: Record<string, unknown>[]): T[] {
    return data.map(item => camelcaseKeys(item) as T);
}

// Get all professors with pagination
export const getAllProfessors = async (
    limit: number = 10,
    offset: number = 0
): Promise<{ professors: IProfessor[]; total: number }> => {
    const { data, error, count } = await supabase
        .from('professors')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('Error fetching professors:', error);
        return { professors: [], total: 0 };
    }

    const camelCaseProfessors = mapArrayToCamelCase<IProfessor>(data || []);

    return { professors: camelCaseProfessors, total: count || 0 };
};

// Insert a new professor
export const insertProfessor = async (
    data: IProfessorInsert
): Promise<IProfessor | null> => {
    // Cast 'data' to 'unknown' first, then to 'Record<string, unknown>'
    const mappedData = snakecaseKeys(data as unknown as Record<string, unknown>);

    const { data: insertedData, error } = await supabase
        .from('professors')
        .insert([mappedData])
        .select('*')
        .single();

    if (error) {
        console.error('Error inserting professor:', error);
        return null;
    }

    const camelCaseData = camelcaseKeys(insertedData) as IProfessor;

    return camelCaseData;
};

// Get professors by department with pagination
export const getProfessorsByDepartment = async (
    department: string,
    limit: number = 10,
    offset: number = 0
): Promise<{ professors: IProfessor[]; total: number }> => {
    const { data, error, count } = await supabase
        .from('professors')
        .select('*', { count: 'exact' })
        .eq('department', department)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('Error fetching professors by department:', error);
        return { professors: [], total: 0 };
    }

    const camelCaseProfessors = mapArrayToCamelCase<IProfessor>(data || []);

    return { professors: camelCaseProfessors, total: count || 0 };
};

// Get professor stats averages for a department
export const getProfessorStatsByDepartment = async (
    department: string
): Promise<{
    total: number;
    averages: {
        preparedness: number;
        clarity: number;
        respect: number;
    };
}> => {
    const { data, error, count } = await supabase
        .from('professors')
        .select('*', { count: 'exact' })
        .eq('department', department);

    if (error) {
        console.error('Error fetching professor stats:', error);
        return {
            total: 0,
            averages: {
                preparedness: 0,
                clarity: 0,
                respect: 0,
            },
        };
    }

    const camelCaseProfessors = mapArrayToCamelCase<IProfessor>(data || []);

    // Calculate averages
    const averages = {
        preparedness: camelCaseProfessors.reduce((sum, p) => sum + p.preparednessPercentage, 0) / camelCaseProfessors.length || 0,
        clarity: camelCaseProfessors.reduce((sum, p) => sum + p.clarityPercentage, 0) / camelCaseProfessors.length || 0,
        respect: camelCaseProfessors.reduce((sum, p) => sum + p.respectPercentage, 0) / camelCaseProfessors.length || 0,
    };

    return { total: count || 0, averages };
};
