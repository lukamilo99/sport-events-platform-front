import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/LoginView.vue';
import Register from '../views/SignUpView.vue';
import Home from "@/views/HomeView.vue";
import OAuthRedirect from "@/views/OAuthRedirect.vue";
import Profile from "@/views/ProfileView.vue";
import CreateEvent from "@/views/CreateEventView.vue";
import Events from "@/views/EventsView.vue";
import {store} from "@/store/store";

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
        meta: {
            requiresAuth: false
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        if (!store.state.user) {
            next('/login');
        } else {
            if (to.meta.roles && to.meta.roles.length > 0) {
                if (to.meta.roles.includes(store.state.user.role)) {
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

router.beforeEach(async (to, from, next) => {
    try {
        if (to.path.includes('/oauth2/authorize') || to.path.includes('/auth/login')) {
            await store.dispatch('setCurrentRoute', to.fullPath);
        }
        next();
    } catch (error) {
        console.error("Error setting current route: ", error);
    }
});

export default router;
