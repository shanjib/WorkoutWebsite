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
    <div
        v-if="props.deleteButton"
        class="spacing">
      <button
        @click="emitDelete"
      >
        <font-awesome-icon :icon="faTrashCan"/>
        Delete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faArrowRotateLeft, faHouse, faTrashCan} from "@fortawesome/free-solid-svg-icons";

import {useRouter} from "vue-router";
import {NavigationProps} from "../types/props";

const router = useRouter();
const props = defineProps<NavigationProps>();
const emit = defineEmits(["emitDelete"]);

async function goHome() {
  await router.push('/');
}

async function goBack() {
  router.back();
}

async function emitDelete() {
  emit("emitDelete");
}
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