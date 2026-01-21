<template>
  <navigation-bar
      title="Exercises"
      :deleteButton=false
  />
  <div>
    <button
        @click="newExercise"
    >
      New Exercise
    </button>
    <p></p>
  </div>
  <exercise-list/>
</template>

<script setup>
import { useRouter } from "vue-router";
import NavigationBar from "../components/NavigationBar.vue";
import ExerciseList from "../components/ExerciseList.vue";
const router = useRouter();

async function newExercise() {
  await router.push(`/exercises/new`);
}
</script>

<style scoped>
</style>
