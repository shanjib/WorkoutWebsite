<template>
  <h2>Past Workouts</h2>
  <div class="p-4">
    <div v-if="isLoading" class="text-gray-500 text-center">
      Loading workouts...
    </div>

    <div v-else-if="error" class="text-red-600 text-center font-semibold">
      ⚠️ {{ error }}
    </div>

    <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <div
          v-for="workout in workouts"
          :key="workout.id"
          class="p-4 bg-white shadow rounded-lg hover:shadow-md transition cursor-pointer"
          @click="goToWorkout(workout.id)"
      >
        <div class="text-xl font-semibold">
          {{ workout.type }} - {{ workout.date }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const workouts = ref([]);
const isLoading = ref(true);
const error = ref(null);

const router = useRouter();

onMounted(async () => {
  try {
    const res = await fetch("/api/workouts/get");

    if (!res.ok) {
      console.error('Failed to fetch workout:', res);
      return;
    }

    workouts.value = await res.json();
  } catch (err) {
    error.value = err.message || "Failed to load workouts";
  } finally {
    isLoading.value = false;
  }
});

function goToWorkout(id) {
  router.push(`/workouts/${id}`);
}
</script>
