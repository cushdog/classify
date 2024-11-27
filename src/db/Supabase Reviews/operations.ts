// db/operations.ts

import { supabase } from '@/lib/supabaseClient';
import { IClassReview, IClassReviewInsert } from './types';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

// Utility function to convert array of objects to camelCase
function mapArrayToCamelCase<T>(data: Record<string, unknown>[]): T[] {
    return data.map(item => camelcaseKeys(item) as T);
}

// Get all class reviews with pagination
export const getAllClassReviews = async (
    limit: number = 10,
    offset: number = 0
): Promise<{ reviews: IClassReview[]; total: number }> => {
    const { data, error, count } = await supabase
        .from('class_reviews')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('Error fetching class reviews:', error);
        return { reviews: [], total: 0 };
    }

    const camelCaseReviews = mapArrayToCamelCase<IClassReview>(data || []);

    return { reviews: camelCaseReviews, total: count || 0 };
};

// Insert a new class review
export const insertClassReview = async (
    data: IClassReviewInsert
): Promise<IClassReview | null> => {
    // Cast 'data' to 'unknown' first, then to 'Record<string, unknown>'
    const mappedData = snakecaseKeys(data as unknown as Record<string, unknown>);

    const { data: insertedData, error } = await supabase
        .from('class_reviews')
        .insert([mappedData])
        .select('*')
        .single();

    if (error) {
        console.error('Error inserting class review:', error);
        return null;
    }

    const camelCaseData = camelcaseKeys(insertedData) as IClassReview;

    return camelCaseData;
};

// Get class reviews by subject and course number with pagination
export const getClassReviewsByCourse = async (
    subject: string,
    courseNumber: string,
    limit: number = 10,
    offset: number = 0
): Promise<{ reviews: IClassReview[]; total: number }> => {
    const { data, error, count } = await supabase
        .from('class_reviews')
        .select('*', { count: 'exact' })
        .eq('subject', subject)
        .eq('course_number', courseNumber)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('Error fetching class reviews by course:', error);
        return { reviews: [], total: 0 };
    }

    const camelCaseReviews = mapArrayToCamelCase<IClassReview>(data || []);

    return { reviews: camelCaseReviews, total: count || 0 };
};

// Additional operations (update, delete) can be added similarly
export const getClassReviewsByCourseWithAverages = async (
    subject: string,
    courseNumber: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<{
    reviews: IClassReview[];
    total: number;
    averages: {
      desireToTake: number;
      understanding: number;
      workload: number;
      expectations: number;
      increasedInterest: number;
    };
  }> => {
    const { data, error, count } = await supabase
      .from('class_reviews')
      .select('*', { count: 'exact' })
      .eq('subject', subject)
      .eq('course_number', courseNumber)
      .range(offset, offset + limit - 1);
  
    if (error) {
      console.error('Error fetching class reviews:', error);
      return {
        reviews: [],
        total: 0,
        averages: {
          desireToTake: 0,
          understanding: 0,
          workload: 0,
          expectations: 0,
          increasedInterest: 0,
        },
      };
    }
  
    const camelCaseReviews = mapArrayToCamelCase<IClassReview>(data || []);
  
    // Calculate averages
    const averages = {
      desireToTake: camelCaseReviews.reduce((sum, r) => sum + r.desireToTakePercentage, 0) / camelCaseReviews.length || 0,
      understanding: camelCaseReviews.reduce((sum, r) => sum + r.understandingPercentage, 0) / camelCaseReviews.length || 0,
      workload: camelCaseReviews.reduce((sum, r) => sum + r.workloadPercentage, 0) / camelCaseReviews.length || 0,
      expectations: camelCaseReviews.reduce((sum, r) => sum + r.expectationsPercentage, 0) / camelCaseReviews.length || 0,
      increasedInterest: camelCaseReviews.reduce((sum, r) => sum + r.increasedInterestPercentage, 0) / camelCaseReviews.length || 0,
    };
  
    return { reviews: camelCaseReviews, total: count || 0, averages };
  };
  
