<template>
  <navigation-bar
      title="Edit Workout"
      :deleteButton=true
      @emitDelete="deleteWorkout"
  />

  <div v-if="isLoading">
    Loading next workout details...
  </div>

  <div v-else-if="error">
    ⚠️ {{ error }}
  </div>

  <div v-else>
    <edit-workout
        :propDate="workoutResponse.workout.date"
        :propType="workoutResponse.workout.type"
        :propExercises="exercises"
        @emitSave="saveWorkout"
    />
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import NavigationBar from "../components/NavigationBar.vue";
import {
  GetWorkoutResponseDTO,
  UpdateWorkoutRequestDTO,
  UpdateWorkoutResponseDTO
} from "../types/workout";
import EditWorkout from "../components/EditWorkout.vue";
import {PropExercise, WorkoutEmit} from "../types/props";

const id = useRoute().params.id;
const router = useRouter();
const isLoading = ref(true);
const error = ref(null);
const title = ref(null);
const workoutResponse = ref<GetWorkoutResponseDTO | null>(null);
const exercises = ref<PropExercise[]>([]);

onMounted(async () => {
  try {
    await fetchWorkout();
  } catch (err) {
    error.value = err || "Failed to fetch workout details";
  } finally {
    isLoading.value = false;
  }
});

async function fetchWorkout() {
  const res = await fetch(`/api/workouts/${id}`);
  if (!res.ok) {
    error.value = res;
    return;
  }

  workoutResponse.value = await res.json();
  title.value = workoutResponse.value.workout.type + " workout for " + workoutResponse.value.workout.date;
  for(const exercise of workoutResponse.value.workout.exercises) {
    let propExercise = {
      name: exercise.name,
      weight: exercise.weight,
      notes: exercise.notes
    }
    exercises.value.push(propExercise);
  }
}

async function saveWorkout(emit: WorkoutEmit) {
  let request = ref<UpdateWorkoutRequestDTO>({ workout: workoutResponse.value.workout});
  request.value.workout.date = emit.date;
  request.value.workout.type = emit.type;
  for (let exercise of request.value.workout.exercises) {
    let propExercise = emit.exerciseMap.get(exercise.name);
    exercise.weight = propExercise.weight;
    exercise.notes = propExercise.notes;
  }

  const res = await fetch(`/api/workouts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request.value)
  })

  const response = ref<UpdateWorkoutResponseDTO | null>(null);
  response.value = await res.json();
  if (!res.ok || !response.value.success) {
    alert("Failed to save workout");
    error.value = res;
    return;
  }

  await router.push(`/workouts/${id}`);
  alert("Workout updated successfully!");
}

async function deleteWorkout() {
  if (confirm("Are you sure you want to delete this exercise?")) {
    const res = await fetch(`/api/workouts/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete workout.");
      return;
    }

    await router.push(`/`);
    alert("Workout deleted successfully!");
  }
}
</script>

<style scoped>

</style>