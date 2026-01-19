<template>
  <div v-if="newExercise">
    <navigation-bar title="New Exercise" />
  </div>
  <div v-else>
    <navigation-bar title="Edit Exercise" />
  </div>
  <edit-exercise/>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import EditExercise from "../components/EditExercise.vue";
import NavigationBar from "../components/NavigationBar.vue";
const router = useRouter();
const id = useRoute().params.id;
const newExercise = id === null || id === undefined;

</script>

<style scoped>
</style>
