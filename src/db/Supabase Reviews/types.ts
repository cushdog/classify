// db/schema.ts

export interface IClassReview {
    id: number;
    createdAt: string; // ISO timestamp
    subject: string;
    courseNumber: string;
    desireToTakePercentage: number;
    understandingPercentage: number;
    workloadPercentage: number;
    expectationsPercentage: number;
    increasedInterestPercentage: number;
}

export interface IClassReviewInsert {
    subject: string;
    courseNumber: string;
    desireToTakePercentage: number;
    understandingPercentage: number;
    workloadPercentage: number;
    expectationsPercentage: number;
    increasedInterestPercentage: number;
}
