<template>
  <div class="exercise-card">
    <h3>{{ editableProps.name }}</h3>

    <div>
      <button
          class="text-button"
          @click="decrement"
      >
        <font-awesome-icon :icon="faMinusCircle"/>
      </button>
      <span style="margin: 0 12px;">{{ editableProps.weight }}</span>
      <button
          class="text-button"
          @click="increment"
      >
        <font-awesome-icon :icon="faPlusCircle"/>
      </button>
    </div>

    <div v-if="editableProps.notes.length > 0" >
      <p>Previous session notes: {{ editableProps.notes }}</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {PropExercise} from "../types/props";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faMinusCircle, faPlusCircle} from "@fortawesome/free-solid-svg-icons";

const props = defineProps<PropExercise>();
const emit = defineEmits(["updateWeight"]);
const editableProps = ref<PropExercise>({
  name: props.name,
  weight: props.weight,
  notes: props.notes
});

function increment() {
  editableProps.value.weight = editableProps.value.weight + 5;
  emit("updateWeight", editableProps.value);
}

function decrement() {
  editableProps.value.weight = editableProps.value.weight - 5;
  emit("updateWeight", editableProps.value);
}
</script>

<style scoped>
.exercise-card {
  background: #ffffff;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  color: black;
}

.text-button {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  color: black; /* optional */
  font-size: 1.5rem;
  cursor: pointer;
}
</style>