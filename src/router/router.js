import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/LoginView.vue';
import Register from '../views/SignUpView.vue';
import Home from "@/views/HomeView.vue";
import OAuthRedirect from "@/views/OAuthRedirect.vue";
import Profile from "@/views/ProfileView.vue";
import CreateEvent from "@/views/CreateEventView.vue";
import Events from "@/views/EventsView.vue";
import {useStore} from "vuex";

const routes = [
    {
        path: '/',
        redirect: '/home',
        meta: {
            requiresAuth: false,
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            requiresAuth: false,
        }
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
        meta: {
            requiresAuth: false,
        }
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/oauth2/redirect',
        name: 'oauthRedirect',
        component: OAuthRedirect,
        meta: {
            blockAccess: true,
            roles: ['ADMIN', 'USER']
        }
    },
    {
        path: '/profile',
        name: 'profile',
        component: Profile,
        meta: {
            requiresAuth: true,
            roles: ['ADMIN', 'USER']
        }
    },
    {
        path: '/create-event',
        name: 'createEvent',
        component: CreateEvent,
        meta: {
            requiresAuth: true,
            roles: ['ADMIN', 'USER']
        }
    },
    {
        path: '/events',
        name: 'events',
        component: Events,
        beforeEnter: (to, from, next) => {
            if (!to.query.page) {
                next({ path: '/events', query: { ...to.query, page: '1' } });
            } else {
                next();
            }
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const store = useStore();
    try {
        if (to.path.includes('/oauth2/authorize') || to.path.includes('/auth/login')) {
            await store.dispatch('setCurrentRoute', to.fullPath);
        }
        next();
    } catch (error) {
        console.error("Error setting current route: ", error);
    }
});

router.beforeEach((to, from, next) => {
    const store = useStore();
    if (to.meta.requiresAuth) {
        if (!store.getters['user']) {
            next('/login');
        } else {
            if (to.meta.roles && to.meta.roles.length > 0) {
                if (to.meta.roles.includes(store.getters['user'].role)) {
                    next();
                } else {
                    next('/no-permission');
                }
            } else {
                next();
            }
        }
    } else {
        next();
    }
});

export default router;
