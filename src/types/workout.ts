export interface WorkoutDTO {
    type: string;
    date: string;
    exercises: WorkoutExerciseDTO[]
}

export interface WorkoutExerciseDTO {
    id: string;
    name: string;
    type: string;
    weight: number;
    setsToReps: NumberToNumberMap;
}

export interface CreateWorkoutRequestDTO {
    type: string;
    date: string;
    exerciseToWeight: StringToNumberMap;
}

export interface CreateWorkoutResponseDTO {
    id: number;
}

export interface GetWorkoutResponseDTO {
    workout: WorkoutDTO;
}

export interface GetNextWorkoutDetailsResponseDTO {
    type: string;
    date: string;
    exerciseToWeight: StringToNumberMap;
}

export interface GetLatestWorkoutsResponseDTO {
    latestWorkouts: GetLatestWorkoutDTO;
}

export interface GetLatestWorkoutDTO {
    id: number;
    type: string;
    date: string;
}

export interface UpdateWorkoutRequestDTO {
    workout: WorkoutDTO;
}

export interface UpdateWorkoutResponseDTO {
    success: boolean;
}

type NumberToNumberMap = {
    [key: number]: number;
}

type StringToNumberMap = {
    [key: string]: number;
}
