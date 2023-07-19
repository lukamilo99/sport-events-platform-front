import { createApp } from 'vue';
import { store } from './store/store';
import App from './App.vue';
import router from './router/router';

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

createApp(App)
    .use(store)
    .use(router)
    .mount('#app');
