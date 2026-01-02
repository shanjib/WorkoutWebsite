<template>
  <div>
    <button class="button" @click="newWorkout()">Auto Create New Workout</button>
  </div>
  <WorkoutList />
  <div>
    <button class="button" @click="manualWorkout()">Manually Create New Workout</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import WorkoutList from '../components/WorkoutList.vue'

const router = useRouter();

const newWorkout = async () => {
  const res = await fetch(`/api/workouts/new`);
  if (!res.ok) {
    console.error('Failed to fetch workout:', res);
    return;
  }
  const workout = await res.json();
  await router.push(`/workouts/${workout.id}`);
}

const manualWorkout = async () => {
  await router.push(`/workouts/new`);
}
</script>

<style scoped>
</style>
