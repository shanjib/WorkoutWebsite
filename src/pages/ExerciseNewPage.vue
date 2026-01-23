<template>
  <navigation-bar
      title="New Exercise"
      :delete-button=false
  />
  <EditExercise
      name="New Exercise"
      type="exercise"
      :weightIncrement=0
      :initialWeight=0
      :reps=0
      :sets=0
      @emitSave="saveExercise"
  />
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import EditExercise from "../components/EditExercise.vue";
import NavigationBar from "../components/NavigationBar.vue";
import {ref} from "vue";
import {CreateExerciseRequestDTO, ExerciseDTO} from "../types/exercise.ts";

const router = useRouter();

async function saveExercise(emit: ExerciseDTO) {
  const request = ref<CreateExerciseRequestDTO>({
    exercises: [emit]
  });
  const res = await fetch("/api/exercises", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(request.value)
  });
  if (!res.ok) {
    error.value = "API returned status " + res.status;
    alert("Failed to save exercise.");
    return;
  }
  await router.push(`/exercises/`);
  alert("Saved!");
}
</script>

<style scoped>
</style>
