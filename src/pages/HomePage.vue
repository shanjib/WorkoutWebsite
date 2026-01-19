<template>
  <div class="flex items-center justify-center w-full">
    Today is {{formattedDate}}
  </div>
  <div class="">
    <button class="button" @click="newWorkout()">New Workout</button>
  </div>
  <WorkoutList />
  <div class="flex items-center justify-center w-full">
    <p></p>
    <button class="button" @click="goToExercises()">Exercises</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import WorkoutList from '../components/WorkoutList.vue'
const router = useRouter();
const formattedDate = new Date().toISOString().split("T")[0];

async function newWorkout() {
  await router.push(`/workouts/new`);
}

async function goToExercises() {
  await router.push("/exercises");
}
</script>

<style scoped>
</style>
