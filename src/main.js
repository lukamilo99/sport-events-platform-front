import { createApp } from 'vue';
import { store } from './store/store';
import App from './App.vue';
import router from './router/router';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

createApp(App)
    .use(store)
    .use(router)
    .mount('#app');
