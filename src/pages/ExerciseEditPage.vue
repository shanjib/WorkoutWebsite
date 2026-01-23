<template>
  <navigation-bar
      title="Edit Exercise"
      :deleteButton=true
      @emitDelete="deleteExercise"
  />
  <div v-if="isLoading">
    Loading exercises...
  </div>

  <div v-else-if="error">
    ⚠️ {{ error }}
  </div>

  <div v-else>
    <EditExercise
        :id="exerciseResponse.exercise.id"
        :name="exerciseResponse.exercise.name"
        :type="exerciseResponse.exercise.type"
        :weightIncrement="exerciseResponse.exercise.weightIncrement"
        :initialWeight="exerciseResponse.exercise.initialWeight"
        :reps="exerciseResponse.exercise.reps"
        :sets="exerciseResponse.exercise.sets"
        @emitSave="saveExercise"
    />
  </div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import NavigationBar from "../components/NavigationBar.vue";
import EditExercise from "../components/EditExercise.vue";
import {onMounted, ref} from "vue";
import {ExerciseDTO, GetExerciseResponseDTO, UpdateExerciseRequestDTO} from "../types/exercise";

const router = useRouter();
const id = useRoute().params.id;
const exerciseResponse = ref<GetExerciseResponseDTO | null>(null);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    await fetchExercise();
  } catch (err) {
    error.value = err.message || "Failed to fetch exercise details";
  } finally {
    isLoading.value = false;
  }
})

async function fetchExercise() {
  const res = await fetch(`/api/exercises/${id}`);
  if (!res.ok) {
    error.value = res;
  }
  exerciseResponse.value = await res.json();
  console.log(exerciseResponse.value);
}

async function saveExercise(emit: ExerciseDTO) {
  const request = ref<UpdateExerciseRequestDTO>({
    exercise: emit
  });
  const res = await fetch(`/api/exercises/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(request.value)
  });
  if (!res.ok) {
    error.value = "API returned status " + res.status;
    alert("Failed to update exercise.");
    return;
  }
  await router.push(`/exercises/`);
  alert("Saved!");
}

async function deleteExercise() {
  if (confirm("Are you sure you want to delete this exercise?")) {
    const res = await fetch(`/api/exercises/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete exercise.");
      return;
    }

    await router.push(`/exercises/`);
    alert("Exercise deleted successfully!");
  }
}

</script>

<style scoped>
</style>
