<template>
  <div v-if="isLoading">
    Loading...
  </div>
  <div v-else-if="error">
    <h1>Workout fetch error for workout {{ id }}</h1>
  </div>
  <div v-else>
    <navigation-bar
        :title="pageTitle"
        :deleteButton=false
    />
    <div>
      <button
          @click="submitWorkout"
      >
        Save
      </button>
      <button
          @click="goToEdit"
      >
        Edit
      </button>
      <p></p>
    </div>

    <div v-for="exercise in workoutResponse.workout.exercises" :key="exercise.id" class="exercise-card">
      <h2 class="title">{{ exercise.name }}</h2>
      <div class="weight-text">
        <p>Working weight is {{ exercise.weight }}lb</p>
        <div v-if="exercise.barExercise">
          Given the initial weight {{ exercise.initialWeight }}lb, on each side please put:

          <div v-for="plate in getPlateLoadout(exercise.weight, exercise.initialWeight)">
            {{ plate.count }} plate(s) weighing {{ plate.plate }}lb
          </div>
        </div>
        <p></p>
      </div>

      <div class="sets-container">
        <div
            v-for="(reps, set) in exercise.setsToReps"
            :key="set"
            class="set-row"
            :class="{ completed: isSetComplete(exercise.id, set) }"
        >
          <div class="set-header">
            <span class="set-label">Set {{ set }}</span>

            <div class="set-actions">
              <button class="btn small" @click="markSet(exercise.id, set, true)">Mark Set</button>
              <button class="btn small outline" @click="markSet(exercise.id, set, false)">Clear</button>
            </div>
          </div>

          <div class="rep-grid">
            <label
                v-for="rep in exercise.reps"
                :key="rep"
                class="rep-box"
            >
              <input
                  type="checkbox"
                  v-model="checked[exercise.id][set][rep]"
                  class="hidden-checkbox"
              />
              <span class="rep-number">{{ rep }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavigationBar from "../components/NavigationBar.vue";
import type {GetWorkoutResponseDTO, UpdateWorkoutRequestDTO} from "../types/workout.ts";
import {ref, reactive, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";

const id = useRoute().params.id;
const router = useRouter();

const isLoading = ref(true);
const error = ref(null);
const workoutResponse = ref<GetWorkoutResponseDTO | null>(null);
const pageTitle = ref("");
const checked = reactive({});

onMounted(async () => {
  try {
    await fetchWorkout();
  } catch (err) {
    error.value = err || "Failed to fetch workout";
  } finally {
    isLoading.value = false;
  }
});

const isSetComplete = (exId, set) => {
  return Object.values(checked[exId][set]).every(v => v === true);
};

const markSet = async (exerciseId, set, value) => {
  for (const rep in checked[exerciseId][set]) {
    checked[exerciseId][set][rep] = value;
  }
};

async function fetchWorkout() {
  const res = await fetch(`/api/workouts/${id}`);
  if (!res.ok) {
    error.value = res;
    return;
  }

  workoutResponse.value = await res.json();
  pageTitle.value = workoutResponse.value.workout.type + " workout for " + workoutResponse.value.workout.date;
  for (const ex of workoutResponse.value.workout.exercises) {
    checked[ex.id] = {};
    for (const [set, rep] of Object.entries(ex.setsToReps)) {
      checked[ex.id][set] = {};
      for (let r = 1; r <= ex.reps; r++) {
        checked[ex.id][set][r] = r <= ex.setsToReps[set];
      }
    }
  }
}

function getPlateLoadout(targetWeight, barWeight = 45, plateSizes = [45, 35, 25, 10, 5, 2.5]) {
  const plateTotal = targetWeight - barWeight;

  if (plateTotal < 0) {
    return {error: "Target weight is less than the bar weight."};
  }

  let weightPerSide = plateTotal / 2;
  const result = [];

  // Sort descending (largest plates first)
  plateSizes = plateSizes.sort((a, b) => b - a);

  for (const plate of plateSizes) {
    const count = Math.floor(weightPerSide / plate);
    if (count > 0) {
      result.push({plate, count});
      weightPerSide -= plate * count;
    }
  }

  if (weightPerSide !== 0) {
    return {error: "Cannot represent the weight exactly with the available plates."};
  }

  return result; // per side
}

async function submitWorkout() {
  const updateRequest = ref<UpdateWorkoutRequestDTO | null>(null);
  updateRequest.value = workoutResponse.value;
  for (const ex of updateRequest.value.workout.exercises) {
    for (const [set, rep] of Object.entries(ex.setsToReps)) {
      let repCount = 0;
      for (let r = 1; r <= ex.reps; r++) {
        if (checked[ex.id][set][r]) {
          repCount++;
        }
      }
      ex.setsToReps[set] = repCount;
    }
  }

  console.log("Submitting workout:", updateRequest.value);
  const res = await fetch('/api/workouts/' + id, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(updateRequest.value)
  });

  if (!res.ok) {
    alert("Failed to update workout");
    return;
  }

  alert("Workout updated successfully!");
}

async function deleteWorkout() {
  if (confirm("Are you sure you want to delete this workout?")) {
    const res = await fetch('/api/workouts/' + id, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete workout");
      return;
    }

    await router.push(`/`);
    alert("Workout deleted successfully!");
  }
}

async function goToEdit() {
  await router.push(`/workouts/edit/${id}`);
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

.workout-title {
  font-size: 2rem;
  margin-bottom: 14px;
  font-weight: 600;
}

.title {
  font-size: 1.4rem;
  margin-bottom: 14px;
  font-weight: 600;
  color: #000000;
}

.weight-text {
  color: #000000;
}

.set-row {
  background: #000000;
  border-radius: 14px;
  padding: 12px;
  margin-bottom: 12px;
  transition: background 0.3s;
}

.set-row.completed {
  background: #007000;
}

.set-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.set-label {
  font-weight: 600;
}

.set-actions {
  display: flex;
  gap: 6px;
}

.btn {
  cursor: pointer;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
}

.btn.small {
  padding: 4px 10px;
}

.btn.outline {
  background: transparent;
  border: 1px solid #aaa;
}

.btn:not(.outline) {
  background: #4a90e2;
  color: white;
}

.rep-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}

.rep-number {
  font-size: 0.75rem;
  color: #555;
}

.hidden-checkbox {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

/* Make the entire box clickable + indicate checked state */
.rep-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 12px 0;
  border-radius: 10px;

  background: #ffffff;
  cursor: pointer;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.08);
  transition: background 0.2s, box-shadow 0.2s;
}

/* Add a subtle highlight when checked */
.rep-box:has(.hidden-checkbox:checked) {
  background: #4ab634;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.15);
}
</style>
