import { createRouter, createWebHistory } from 'vue-router';

import HomePage from './pages/HomePage.vue'
import WorkoutPage from './pages/WorkoutPage.vue';
import WorkoutEditPage from './pages/WorkoutEditPage.vue'
import WorkoutNewPage from './pages/WorkoutNewPage.vue';
import ExercisePage from "./pages/ExercisePage.vue";
import NewExercisePage from "./pages/NewExercisePage.vue";

const routes = [
    { path: '/', component: HomePage },
    { path: '/workouts/:id', component: WorkoutPage },
    { path: '/workouts/edit/:id', component: WorkoutEditPage },
    { path: '/workouts/new', component: WorkoutNewPage },
    { path: '/exercises/', component: ExercisePage },
    { path: '/exercises/new', component: NewExercisePage },
    { path: '/exercises/:id', component: NewExercisePage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
