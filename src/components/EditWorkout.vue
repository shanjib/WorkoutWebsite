<template>

  <div>
    <label>Workout Date</label>
    <input
        type="date"
        v-model="editableProps.propDate"
    />
  </div>

  <!-- Workout Type Dropdown -->
  <div>
    <label>Workout Type</label>
    <select
        v-model="editableProps.propType"
    >
      <option value="">-- Select --</option>
      <option value="PUSH">PUSH</option>
      <option value="PULL">PULL</option>
      <option value="LEG">LEG</option>
      <option value="CARDIO">CARDIO</option>
    </select>
  </div>

  <!-- Exercises Section -->
  <h2>Exercises</h2>
  <div
      v-for="(exercise) in editableProps.propExercises"
  >
    <edit-workout-exercise
        :name="exercise.name"
        :weight="exercise.weight"
        notes=""
        @updateWeight="updateExercise"
    />
  </div>
  <button
      @click="emitSave"
  >
    <font-awesome-icon :icon="faFloppyDisk"/>
    Save
  </button>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {EditWorkoutProps, PropExercise, WorkoutEmit} from "../types/props";
import {faFloppyDisk} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import EditWorkoutExercise from "./EditWorkoutExercise.vue";

const props = defineProps<EditWorkoutProps>();
const emit = defineEmits(["emitSave"]);
const editableProps = ref<EditWorkoutProps>({
    propDate: props.propDate,
    propType: props.propType,
    propExercises: props.propExercises,
  });
const exerciseMap = new Map<string, PropExercise>([]);

onMounted(() => {
  for (let exercise of editableProps.value.propExercises) {
    exerciseMap.set(exercise.name, exercise);
  }
})

function updateExercise(emitMessage: PropExercise) {
  exerciseMap.set(emitMessage.name, emitMessage);
}

async function emitSave() {
  let emitMessage = ref<WorkoutEmit>({
    date: editableProps.value.propDate,
    type: editableProps.value.propType,
    exerciseMap: exerciseMap
  });
  emit("emitSave", emitMessage.value);
}
</script>