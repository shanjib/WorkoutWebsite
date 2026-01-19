<template>
  <div class="nav-bar">
    <button
        class="spacing"
        @click="goHome"
    >
      <font-awesome-icon :icon="faHouse"/>
    </button>
    <button
        class="spacing"
        @click="goBack"
    >
     <font-awesome-icon :icon="faArrowRotateLeft"/>
    </button>
    <h2 class="spacing">{{ title }}</h2>
  </div>
</template>

<script setup>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faArrowRotateLeft, faHouse} from "@fortawesome/free-solid-svg-icons";

import {useRouter} from "vue-router";

const router = useRouter();
const props = defineProps({
  title: String
})

async function goHome() {
  await router.push('/');
}

async function goBack() {
  await router.back();
}
</script>

<script lang="ts">
</script>

<style scoped>
.nav-bar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.spacing {
  margin-left: 10px;
}
</style>