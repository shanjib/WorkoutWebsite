<template>
  <navigation-bar
      title="New Workout"
      :delete-button=false
  />
  <div v-if="isLoading">
    Loading next workout details...
  </div>

  <div v-else-if="error">
    ⚠️ {{ error }}
  </div>

  <div v-else>
    <edit-workout
        :prop-date="nextWorkoutDetails.date"
        :prop-type="nextWorkoutDetails.type"
        :prop-exercises="exercises"
        @emitSave="saveWorkout"
    />
  </div>
</template>

<script setup lang="ts">
import type {
  GetNextWorkoutDetailsResponseDTO,
  CreateWorkoutRequestDTO,
  CreateWorkoutResponseDTO
} from "../types/workout.ts"
import {ref, onMounted} from "vue";
import {useRouter} from "vue-router";
import NavigationBar from "../components/NavigationBar.vue";
import EditWorkout from "../components/EditWorkout.vue";
import {PropExercise, WorkoutEmit} from "../types/props";

const nextWorkoutDetails = ref<GetNextWorkoutDetailsResponseDTO | null>(null);
const exercises = ref<PropExercise[]>([]);
const isLoading = ref(true);
const error = ref(null);
const router = useRouter();

onMounted(async () => {
  try {
    await getNextWorkoutDetails();
  } catch (err) {
    error.value = err || "Failed to fetch workout details";
  } finally {
    isLoading.value = false;
  }
});

async function getNextWorkoutDetails() {
  const res = await fetch(`/api/workouts/next`);
  if (!res.ok) {
    error.value = "API returned status " + res.status;
    return;
  }
  nextWorkoutDetails.value = await res.json();
  for(let exercise in nextWorkoutDetails.value.exerciseToWeight) {
    let propExercise = {
      name: exercise,
      weight: nextWorkoutDetails.value.exerciseToWeight[exercise],
    }
    exercises.value.push(propExercise);
  }
}

async function saveWorkout(emit: WorkoutEmit) {
  let request = ref<CreateWorkoutRequestDTO>(nextWorkoutDetails.value);
  request.value.date = emit.date;
  request.value.type = emit.type;
  for (let exercise in request.value.exerciseToWeight) {
    let propExercise = emit.exerciseMap.get(exercise);
    request.value.exerciseToWeight[exercise] = propExercise.weight;
  }
  console.log("Submitting workout:", request.value);

  const res = await fetch("/api/workouts", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(request.value)
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
