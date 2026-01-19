<template>
  <div v-if="isLoading" class="text-gray-500 text-center">
    Loading exercises...
  </div>

  <div v-else-if="error" class="text-red-600 text-center font-semibold">
    ⚠️ {{ error }}
  </div>

  <div
      v-else
      class="exercise-editor card"
  >
    <form>
      <div class="form-row">
        <label>Name</label>
        <input v-model="exerciseRequest.name" type="text" required/>
      </div>

      <div class="form-row">
        <label>Type</label>
        <select v-model="exerciseRequest.type">
          <option value="PUSH">PUSH</option>
          <option value="PULL">PULL</option>
          <option value="LEGS">LEGS</option>
        </select>
      </div>

      <div class="form-row">
        <label>Sets</label>
        <input v-model.number="exerciseRequest.sets" type="number" min="1" required/>
      </div>

      <div class="form-row">
        <label>Reps</label>
        <input v-model.number="exerciseRequest.reps" type="number" min="1" required/>
      </div>

      <div class="form-row">
        <label>Weight Increment</label>
        <input v-model.number="exerciseRequest.weightIncrement" type="number" min="0" step="1"/>
      </div>

      <div class="form-row">
        <label>Initial Weight</label>
        <input v-model.number="exerciseRequest.initialWeight" type="number" min="0" step="1"/>
      </div>

      <div class="form-row">
        <button
            @click="saveExercise"
        >
          <font-awesome-icon :icon="faFloppyDisk"/>
          Save
        </button>
      </div>

      <div v-if="!newExercise"
           class="form-row"
      >
        <button
            @click="deleteExercise"
        >
          <font-awesome-icon :icon="faTrashCan"/>
          Delete
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faFloppyDisk, faPenToSquare, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {
  CreateExerciseRequestDTO,
  CreateExerciseResponseDTO,
  ExerciseDTO,
  GetExerciseResponseDTO, UpdateExerciseRequestDTO
} from "../types/exercise";

const id = useRoute().params.id;
const router = useRouter();
const exerciseResponse = ref<GetExerciseResponseDTO | null>(null);
const exerciseRequest = ref<ExerciseDTO | null>(null);
const newExercise = id === null || id === undefined;
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  if (newExercise) {
    isLoading.value = false;
    exerciseRequest.value = {
      name: "New Exercise",
      type: "exercise",
      weightIncrement: 0,
      initialWeight: 0,
      reps: 0,
      sets: 0
    };
  } else {
    await loadExercise();
  }
})

async function loadExercise() {
  try {
    const res = await fetch("/api/exercises/" + id);
    if (!res.ok) {
      error.value = "API returned status " + res.status;
    }
    exerciseResponse.value = await res.json();
    exerciseRequest.value = exerciseResponse.value.exercise;
  } catch (err) {
    error.value = err.message || "Failed to load exercises";
  } finally {
    isLoading.value = false;
  }
}

async function saveExercise() {
  if (newExercise) {
    const request = ref<CreateExerciseRequestDTO | null>(null);
    request.value = {
      exercises: [exerciseRequest.value]
    }
    console.log("Creating exercise:", request.value);

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
  } else {
    const request = ref<UpdateExerciseRequestDTO | null>(null);
    request.value = {
      exercise: exerciseRequest.value
    }
    const res = await fetch("/api/exercises/" + id, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(request.value)
    });
    if (!res.ok) {
      error.value = "API returned status " + res.status;
      alert("Failed to update exercise.");
      return;
    }
  }
  alert("Saved!");
}

async function deleteExercise() {
  if (confirm("Are you sure you want to delete this exercise?")) {
    const res = await fetch('/api/exercises/' + id, {
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
.exercise-editor {
  max-width: 400px;
  margin: auto;
  text-align: left;
}

.form-row {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 4px;
}
</style>
