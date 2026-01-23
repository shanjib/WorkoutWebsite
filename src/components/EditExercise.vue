<template>
  <form>
    <div class="form-row">
      <label>Name</label>
      <input v-model="editableProps.name" type="text" required/>
    </div>

    <div class="form-row">
      <label>Type</label>
      <select v-model="editableProps.type">
        <option value="PUSH">PUSH</option>
        <option value="PULL">PULL</option>
        <option value="LEGS">LEGS</option>
      </select>
    </div>

    <div class="form-row">
      <label>Sets</label>
      <input v-model.number="editableProps.sets" type="number" min="1" required/>
    </div>

    <div class="form-row">
      <label>Reps</label>
      <input v-model.number="editableProps.reps" type="number" min="1" required/>
    </div>

    <div class="form-row">
      <label>Weight Increment</label>
      <input v-model.number="editableProps.weightIncrement" type="number" min="0" step="1"/>
    </div>

    <div class="form-row">
      <label>Initial Weight</label>
      <input v-model.number="editableProps.initialWeight" type="number" min="0" step="1"/>
    </div>

    <div class="form-row">
      <button
          @click="emitSave"
      >
        <font-awesome-icon :icon="faFloppyDisk"/>
        Save
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faFloppyDisk} from "@fortawesome/free-solid-svg-icons";
import {ref} from "vue";
import {ExerciseDTO} from "../types/exercise";

const props = defineProps<ExerciseDTO>();
const emit = defineEmits(["emitSave"])
const editableProps = ref<ExerciseDTO>({
  id: props.id,
  name: props.name,
  type: props.type,
  weightIncrement: props.weightIncrement,
  initialWeight: props.initialWeight,
  reps: props.reps,
  sets: props.sets
});

async function emitSave() {
  emit("emitSave", editableProps.value);
}

</script>

<style scoped>
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
