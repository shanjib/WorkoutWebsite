<template>
  <div class="p-6 space-y-6 max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold">Create Workout</h1>

    <!-- Date Input -->
    <div>
      <label class="block text-sm font-medium mb-1">Workout Date</label>
      <input
          type="date"
          v-model="date"
          class="w-full border rounded px-3 py-2"
      />
    </div>

    <!-- Workout Type Dropdown -->
    <div>
      <label class="block text-sm font-medium mb-1">Workout Type</label>
      <select
          v-model="workoutType"
          @change="loadExercises"
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
    <div v-if="isLoadingExercises" class="text-gray-500">
      Loading exercises...
    </div>

    <div v-if="exerciseError" class="text-red-600">
      {{ exerciseError }}
    </div>

    <div v-if="exercises.length > 0" class="space-y-6">
      <h2 class="text-xl font-semibold">Exercises</h2>

      <div
          v-for="(ex, index) in exercises"
          :key="ex.id"
          class="p-4 border rounded-lg bg-white shadow-sm"
      >
        <div class="text-lg font-bold mb-3">
          {{ ex.name }}
        </div>

        <!-- Weight -->
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Weight</label>
          <input
              type="number"
              v-model.number="ex.weight"
              class="w-full border rounded px-3 py-2"
          />
        </div>

        <!-- Reps per set -->
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Reps Per Set</label>
          <input
              type="number"
              v-model.number="ex.reps"
              class="w-full border rounded px-3 py-2"
          />
        </div>

        <!-- Sets -->
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Sets</label>
          <input
              type="number"
              v-model.number="ex.sets"
              class="w-full border rounded px-3 py-2"
          />
        </div>
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

<script setup>
import { ref } from "vue";

const date = ref("");
const workoutType = ref("");
const exercises = ref([]);

const isLoadingExercises = ref(false);
const exerciseError = ref(null);

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
  const payload = {
    date: date.value,
    type: workoutType.value,
    trackedExercises: exercises.value
  };

  console.log("Submitting workout:", payload);

  const res = await fetch("/api/workouts/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    alert("Failed to create workout");
    return;
  }

  alert("Workout created!");
}
</script>
