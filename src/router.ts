import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router';

// Pages are loaded on demand, so the entry bundle stays small
const HomePage = () => import('@/pages/home/HomePage.vue');
const AboutPage = () => import('@/pages/about/AboutPage.vue');
const ContactPage = () => import('@/pages/contact/ContactPage.vue');

const routes: RouteRecordRaw[] = [
    {name: 'home', path: '/', component: HomePage},
    {name: 'about', path: '/about', component: AboutPage},
    {name: 'contact', path: '/contact', component: ContactPage},
    {path: '/:pathMatch(.*)*', redirect: {name: 'home'}},
];

const router = createRouter({
    // BASE_URL follows vite's `base`, so routes work under the GitHub Pages /<repo>/ prefix
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
