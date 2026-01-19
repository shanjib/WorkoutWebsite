<template>
  <div v-if="isLoading">
    Loading next workout details...
  </div>

  <div v-else-if="error">
    ⚠️ {{ error }}
  </div>

  <div v-else>
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
        <p>{{ exercise }}</p>
        <p>Previous session notes: {{ createWorkoutRequest.exerciseToNotes[exercise] }}</p>
      </div>

      <!-- Weight -->
      <div class="mb-3">
        <label class="block text-sm font-medium mb-1">Weight</label>
        <input
            type="number"
            :value="weight"
            @input="createWorkoutRequest.exerciseToWeight[exercise] = +$event.target.value"
            class="w-full border rounded px-3 py-2"
        />
      </div>
    </div>

    <!-- Submit Button -->
    <p></p>
    <button
        @click="submitWorkout"
        class="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
    >
      Create Workout
    </button>
  </div>
</template>

<script setup lang="ts">
import type {GetNextWorkoutDetailsResponseDTO, CreateWorkoutRequestDTO, CreateWorkoutResponseDTO} from "@/types/workout.ts"
import { ref, onMounted } from "vue";
import {useRouter} from "vue-router";

const nextWorkoutDetails = ref<GetNextWorkoutDetailsResponseDTO | null>(null);
const createWorkoutRequest = ref<CreateWorkoutRequestDTO | null>(null);
const isLoading = ref(true);
const error = ref(null);
const router = useRouter();

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
    console.log(nextWorkoutDetails.value);
    createWorkoutRequest.value = nextWorkoutDetails.value;
  } catch (err) {
    error.value = err;
  } finally {
    isLoading.value = false;
  }
}

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
  const id = ref<CreateWorkoutResponseDTO | null>(null);
  id.value = await res.json();

  await router.push(`/workouts/${id.value.id}`);
  alert("Workout created!");
}
</script>
