export interface NavigationProps {
    title: string;
    deleteButton: boolean;
}

export interface PropExercise {
    name: string;
    weight: number;
    notes: number;
}

export interface EditWorkoutProps {
    propDate: string;
    propType: string;
    propExercises: PropExercise[];
}

export interface WorkoutEmit {
    date: string;
    type: string;
    exerciseMap: Map<string, PropExercise>;
}