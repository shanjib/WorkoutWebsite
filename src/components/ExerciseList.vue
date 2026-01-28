<template>
  <div v-if="isLoading">
    Loading exercises...
  </div>

  <div v-else-if="error">
    ⚠️ {{ error }}
  </div>

  <div v-else-if="exerciseResponse.exercises.length == 0">
    No exercises found.
  </div>

  <div v-else>
    <div
        v-for="exercise in exerciseResponse.exercises"
        class="exercise-card"
    >
      <p class="title">{{ exercise.name }}</p>
      <table class="exercise-info">
        <tbody>
        <tr>
          <td>Type</td>
          <td>{{ exercise.type }}</td>
        </tr>
        <tr>
          <td>Sets</td>
          <td>{{ exercise.sets }}</td>
        </tr>
        <tr>
          <td>Reps</td>
          <td>{{ exercise.reps }}</td>
        </tr>
        <tr>
          <td>Initial Weight</td>
          <td>{{ exercise.initialWeight }}</td>
        </tr>
        <tr>
          <td>Weight Increment</td>
          <td>{{ exercise.weightIncrement }}</td>
        </tr>
        <tr>
          <td
              colspan="2"
              style="text-align: center"
          >
            <button
                @click="editExercise(exercise.id)"
            >
              <font-awesome-icon :icon="faPenToSquare"/>
              Edit
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {GetExercisesResponseDTO} from "../types/exercise";

const router = useRouter();
const exerciseResponse = ref<GetExercisesResponseDTO | null>(null);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  await loadExercises();
})

async function loadExercises() {
  try {
    const res = await fetch("/api/exercises");
    if (!res.ok) {
      error.value = "API returned status " + res.status;
    }
    exerciseResponse.value = await res.json();
  } catch (err) {
    error.value = err.message || "Failed to load exercises";
  } finally {
    isLoading.value = false;
  }
}

async function editExercise(exerciseId: number) {
  await router.push(`/exercises/${exerciseId}`);
}

async function deleteExercise() {
  if (confirm("Are you sure?")) {

  }
}

</script>

<style scoped>
.exercise-card {
  background: #ffffff;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 1.4rem;
  margin-bottom: 14px;
  font-weight: 600;
  color: #000000;
}

.exercise-info {
  border: 1px solid;
  border-collapse: collapse;
  text-align: left;
  width: 100%;
  color: #000000;
}

td {
  border: 1px solid #000000;
}

</style>
