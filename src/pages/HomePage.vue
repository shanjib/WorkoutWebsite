<template>
  <div class="flex items-center justify-center w-full">
    Today is {{formattedDate}}
  </div>
  <div class="">
    <button class="button" @click="newWorkout()">New Workout</button>
  </div>
  <WorkoutList />
  <div class="flex items-center justify-center w-full">
    button for exercises
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import WorkoutList from '../components/WorkoutList.vue'
const router = useRouter();
const formattedDate = new Date().toISOString().split("T")[0];

const newWorkout = async () => {
  await router.push(`/workouts/new`);
}
</script>

<style scoped>
</style>
