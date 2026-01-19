import { createRouter, createWebHistory } from 'vue-router';

import HomePage from './pages/HomePage.vue'
import WorkoutPage from './pages/WorkoutPage.vue';
import NewWorkoutPage from './pages/NewWorkoutPage.vue';
import ExercisePage from "./pages/ExercisePage.vue";
import NewExercisePage from "./pages/NewExercisePage.vue";

const routes = [
    { path: '/', component: HomePage },
    { path: '/workouts/:id', component: WorkoutPage },
    { path: '/workouts/new', component: NewWorkoutPage },
    { path: '/exercises/', component: ExercisePage },
    { path: '/exercises/new', component: NewExercisePage },
    { path: '/exercises/:id', component: NewExercisePage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
