import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/LoginView.vue';
import Register from '../views/SignUpView.vue';
import Home from "@/views/HomeView.vue";
import OAuthRedirect from "@/views/OAuthRedirect.vue";
import MyProfile from "@/views/MyProfileView.vue";
import MyEvents from "@/views/MyEventsView.vue";
import CreateEvent from "@/views/CreateEventView.vue";
import EditEvent from "@/views/EditEventView.vue";
import Events from "@/views/EventsView.vue";
import EventDetails from "@/views/EventDetailsView.vue"
import MyFriends from "@/views/MyFriendsView.vue"
import User from "@/views/UsersView.vue"
import NotFound from "@/views/NotFoundView.vue"
import Connect from "@/views/ConnectView.vue"

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
        path: '/profile/info',
        name: 'myProfile',
        component: MyProfile,
        meta: {
            requiresAuth: true,
            roles: ['ADMIN', 'USER']
        }
    },
    {
        path: '/profile/friends',
        name: 'myFriends',
        component: MyFriends,
        meta: {
            requiresAuth: true,
            roles: ['ADMIN', 'USER']
        }
    },
    {
        path: '/profile/events',
        name: 'myEvents',
        component: MyEvents,
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
        path: '/edit-event/:eventId',
        name: 'editEvent',
        component: EditEvent,
        meta: {
            requiresAuth: true,
            roles: ['ADMIN', 'USER']
        },
        beforeEnter: (to, from, next) => {
            if (!to.params.eventId) {
                next({ path: '/not-found' });
            } else {
                next();
            }
        }
    },
    {
        path: '/event/:eventName/:eventId',
        name: 'eventDetails',
        component: EventDetails,
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
    },
    {
        path: '/users',
        name: 'users',
        component: User,
        meta: {
            requiresAuth: true,
            roles: ['ADMIN', 'USER']
        },
        beforeEnter: (to, from, next) => {
            if (!to.query.page) {
                next({ path: '/users', query: { ...to.query, page: '1' } });
            } else {
                next();
            }
        }
    },
    {
        path: '/connect',
        name: 'connect',
        component: Connect,
        meta: {
            requiresAuth: true,
            roles: ['ADMIN', 'USER']
        },
        beforeEnter: (to, from, next) => {
            if (!to.query.page) {
                next({ path: '/connect', query: { ...to.query, page: '1' } });
            } else {
                next();
            }
        }
    },
    {
        path: '/not-found',
        name: 'notFound',
        component: NotFound
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
