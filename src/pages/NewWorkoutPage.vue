<template>
  <div v-if="isLoading" class="text-gray-500 text-center">
    Loading next workout details...
  </div>

  <div v-else-if="error" class="text-red-600 text-center font-semibold">
    ⚠️ {{ error }}
  </div>

  <div v-else class="p-6 space-y-6 max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold">Create Workout</h1>

    <!-- Date Input -->
    <div>
      <label class="block text-sm font-medium mb-1">Workout Date</label>
      <input
          type="date"
          v-model="createWorkoutRequest.date"
          class="w-full border rounded px-3 py-2"
      />
    </div>

    <!-- Workout Type Dropdown -->
    <div>
      <label class="block text-sm font-medium mb-1">Workout Type</label>
      <select
          v-model="createWorkoutRequest.type"
          class="w-full border rounded px-3 py-2"
      >
        <option value="">-- Select --</option>
        <option value="PUSH">PUSH</option>
        <option value="PULL">PULL</option>
        <option value="LEG">LEG</option>
        <option value="CARDIO">CARDIO</option>
      </select>
    </div>

    <!-- Exercises Section -->
    <h2 class="text-xl font-semibold">Exercises</h2>

    <div
        v-for="(weight, exercise, index) in createWorkoutRequest.exerciseToWeight"
        class="p-4 border rounded-lg bg-white shadow-sm"
    >
      <div class="text-lg font-bold mb-3">
        {{ exercise }}
      </div>

      <!-- Weight -->
      <div class="mb-3">
        <label class="block text-sm font-medium mb-1">Weight</label>
        <input
            type="number"
            :value="weight"
            @input="createWorkoutRequest.exerciseToWeight[index] = +$event.target.value"
            class="w-full border rounded px-3 py-2"
        />
      </div>

    </div>

    <!-- Submit Button -->
    <button
        @click="submitWorkout"
        class="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
    >
      Create Workout
    </button>
  </div>
</template>

<script setup lang="ts">
import type {GetNextWorkoutDetailsResponseDTO, CreateWorkoutRequestDTO} from "@/types/workout.ts"
import { ref, onMounted } from "vue";
const nextWorkoutDetails = ref<GetNextWorkoutDetailsResponseDTO | null>(null);
const createWorkoutRequest = ref<CreateWorkoutRequestDTO | null>(null);
const isLoading = ref(true);
const error = ref(null);

const date = ref("");
const workoutType = ref("");
const exercises = ref([]);

const isLoadingExercises = ref(false);
const exerciseError = ref(null);

onMounted(async () => {
  await getNextWorkoutDetails();
});

async function getNextWorkoutDetails() {
  try {
    const res = await fetch(`/api/workouts/next`);
    if (!res.ok) {
      error.value = "API returned status " + res.status;
      return;
    }
    nextWorkoutDetails.value = await res.json();
    createWorkoutRequest.value = nextWorkoutDetails.value;
  } catch (err) {
    error.value = err;
  } finally {
    isLoading.value = false;
  }
}

// Fetch exercises when workout type is selected
async function loadExercises() {
  exercises.value = [];
  exerciseError.value = null;

  if (!workoutType.value) return;

  try {
    isLoadingExercises.value = true;

    const res = await fetch(`/api/exercises/type/${workoutType.value}`);
    if (!res.ok) {
      throw new Error("Failed to load exercises due to error: " + res.status + res.statusText);
    }

    const data = await res.json();

    // Give each exercise editable fields
    exercises.value = data.map(ex => ({
      ...ex,
      weight: ex.initialWeight || 0,
      reps: ex.reps || 5,
      sets: ex.sets || 5
    }));
  } catch (err) {
    exerciseError.value = err.message;
  } finally {
    isLoadingExercises.value = false;
  }
}

// Submit entire new workout
async function submitWorkout() {
  console.log("Submitting workout:", createWorkoutRequest.value);

  const res = await fetch("/api/workouts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(createWorkoutRequest.value)
  });

  if (!res.ok) {
    alert("Failed to create workout");
    return;
  }

  alert("Workout created!");
}
</script>
