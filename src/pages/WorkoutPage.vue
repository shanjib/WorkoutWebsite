<template>
  <div v-if="workoutFetchError">
    <h1>Workout fetch error for workout {{id}}</h1>
  </div>
  <div v-else>
    <h1 class="workout-title">{{workout.type}} workout for {{workout.date}}</h1>
  </div>
  <div v-for="exercise in workout.trackedExercises" :key="exercise.id" class="exercise-card">
    <h2 class="title">{{ exercise.name }}</h2>
    <div class="weight-text">
      <p>Working weight is {{ exercise.weight }}lb</p>
      <div v-if="needsPlateLoadout(exercise.initialWeight)">
        On each side please put:

        <div v-for="plate in getPlateLoadout(exercise.weight, exercise.initialWeight)">
          {{ plate.count }} plate weighing {{ plate.plate }}lb
        </div>
      </div>
      <p></p>
    </div>

    <div class="sets-container">
      <div
          v-for="set in exercise.sets"
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
                @change="updateRep(exercise.id, set, rep)"
            />
            <span class="rep-number">{{ rep }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const id = route.params.id;

const workout = ref({
  trackedExercises: []
});
const workoutFetchError = ref(null);

const checked = reactive({});

const isSetComplete = (exId, set) => {
  return Object.values(checked[exId][set]).every(v => v === true);
};

const markSet = async (exerciseId, set, value) => {
  for (const rep in checked[exerciseId][set]) {
    checked[exerciseId][set][rep] = value;
  }

  try {
    await fetch(`/api/exercises/tracked/update/${exerciseId}?set=${set}&successfulSet=${value}`, {
      method: 'POST',
    });
  } catch (err) {
    console.error('Failed to update rep:', err);
  }
};

const fetchWorkout = async () => {
  const res = await fetch(`/api/workouts/get/${id}`);
  if (!res.ok) {
    workoutFetchError.value = true;
    console.error('Failed to fetch workout:', res);
    return;
  }

  workout.value = await res.json();
  for (const ex of workout.value.trackedExercises) {
    checked[ex.id] = {};

    for (let s = 1; s <= ex.sets; s++) {
      checked[ex.id][s] = {};
      for (let r = 1; r <= ex.reps; r++) {
        checked[ex.id][s][r] = r <= ex.repsPerSet[s];
      }
    }
  }
};

const updateRep = async (exerciseId, set, rep) => {
  const isChecked = checked[exerciseId][set][rep];
  try {
    await fetch(`/api/exercises/tracked/update/${exerciseId}?set=${set}&successfulRep=${isChecked}`, {
      method: 'POST',
    });
  } catch (err) {
    console.error('Failed to update rep:', err);
  }
};

function needsPlateLoadout(initialWeight) {
  return initialWeight !== 0;
}

function getPlateLoadout(targetWeight, barWeight = 45, plateSizes = [45, 35, 25, 10, 5, 2.5]) {
  const plateTotal = targetWeight - barWeight;

  if (plateTotal < 0) {
    return { error: "Target weight is less than the bar weight." };
  }

  let weightPerSide = plateTotal / 2;
  const result = [];

  // Sort descending (largest plates first)
  plateSizes = plateSizes.sort((a, b) => b - a);

  for (const plate of plateSizes) {
    const count = Math.floor(weightPerSide / plate);
    if (count > 0) {
      result.push({ plate, count });
      weightPerSide -= plate * count;
    }
  }

  if (weightPerSide !== 0) {
    return { error: "Cannot represent the weight exactly with the available plates." };
  }

  return result; // per side
}

onMounted(fetchWorkout);
</script>

<style scoped>
.exercise-card {
  background: #ffffff;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  width: 75vw;
  max-width: 500px;
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
  box-shadow: 0 1px 5px rgba(0,0,0,0.08);
  transition: background 0.2s, box-shadow 0.2s;
}

/* Add a subtle highlight when checked */
.rep-box:has(.hidden-checkbox:checked) {
  background: #4ab634;
  box-shadow: 0 1px 8px rgba(0,0,0,0.15);
}
</style>
