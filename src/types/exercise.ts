export interface ExerciseDTO {
    id?: number;
    name: string;
    type: string;
    weightIncrement?: number;
    initialWeight?: number;
    reps?: number;
    sets?: number;
}

export interface CreateExerciseRequestDTO {
    exercises: ExerciseDTO[];
}

export interface CreateExerciseResponseDTO {
    exercises: CreateExerciseDTO[];
}

export interface CreateExerciseDTO {
    id: number;       // Java long → TS number
    name: string;
    success: boolean;
}

export interface GetExerciseResponseDTO {
    exercise: ExerciseDTO;
}

export interface GetExercisesResponseDTO {
    exercises: ExerciseDTO[];
}

export interface UpdateExerciseRequestDTO {
    exercise: ExerciseDTO;
}

export interface UpdateExerciseResponseDTO {
    success: boolean;
}