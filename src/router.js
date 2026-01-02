import { createRouter, createWebHistory } from 'vue-router';

import HomePage from './pages/HomePage.vue'
import WorkoutPage from './pages/WorkoutPage.vue';
import NewWorkoutPage from './pages/NewWorkoutPage.vue';

const routes = [
    { path: '/', component: HomePage },
    { path: '/workouts/:id', component: WorkoutPage },
    { path: '/workouts/new', component: NewWorkoutPage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
