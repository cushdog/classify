// db/SupabaseProfessorReviews/operations.ts

import { supabase } from '@/lib/Library Functions and Clients/supabaseClient';
import { IProfessor, IProfessorInsert } from './types';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

// Get professor by name
export const getProfessorByName = async (
  firstName: string,
  lastName: string
): Promise<IProfessor | null> => {
  const { data, error } = await supabase
    .from('professors')
    .select('*')
    .eq('first_name', firstName)
    .eq('last_name', lastName)
    .single();

  if (error) {
    console.error('Error fetching professor by name:', error);
    return null;
  }

  const professor = camelcaseKeys(data) as IProfessor;

  return professor;
};

// Insert a new professor
export const insertProfessor = async (
  data: IProfessorInsert
): Promise<IProfessor | null> => {
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

  const professor = camelcaseKeys(insertedData) as IProfessor;

  return professor;
};

export const getProfessorRatingsByName = async (
    firstName: string,
    lastName: string
  ): Promise<IProfessor | null> => {
    const { data, error } = await supabase
      .from('professors')
      .select('*')
      .eq('first_name', firstName)
      .eq('last_name', lastName)
      .single();
  
    if (error) {
      console.error('Error fetching professor ratings by name:', error);
      return null;
    }
  
    const professor = camelcaseKeys(data) as IProfessor;
  
    return professor;
  };
