export interface IProfessor {
    id: number;
    createdAt: string;
    firstName: string;
    lastName: string;
    email?: string;
    department?: string;
    preparednessPercentage: number;
    clarityPercentage: number;
    respectPercentage: number;
}

export interface IProfessorInsert {
    firstName: string;
    lastName: string;
    email?: string;
    department?: string;
    preparednessPercentage: number;
    clarityPercentage: number;
    respectPercentage: number;
}
