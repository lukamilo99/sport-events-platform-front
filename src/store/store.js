import { createStore } from 'vuex';
import axios from 'axios';
import router from "@/router/router";


export const store = createStore({
    state: {
        user: null,
        currentRoute: '/',
    },
    mutations: {
        SET_USER(state, user) {
            state.user = user;
        },
        SET_CURRENT_ROUTE(state, route) {
            state.currentRoute = route;
        }
    },
    actions: {
        async register(_, credentials) {
            await axios.post('http://localhost:8081/auth/register', credentials);
        },
        async login(_, credentials) {
            const response = await axios.post(`http://localhost:8081/auth/login`, credentials);
            console.log(response.data)
            if (response.data) {
                localStorage.setItem('jwt', response.data);
            }
        },
        async googleLogin() {
            window.location.href = 'http://localhost:8081/oauth2/authorize/google?redirect_uri=http://localhost:8080/oauth2/redirect';
        },
        async logout({ commit }) {
            localStorage.removeItem('jwt');
            commit('SET_USER', null);
        },
        async updateProfile(_, credentials) {
            await axios.put('http://localhost:8081/user/update', credentials);
        },
        setCurrentRoute({ commit }, route) {
            commit('SET_CURRENT_ROUTE', route);
        },
        async fetchUserAndRedirect({ commit, state }) {
            try {
                const response = await axios.get('http://localhost:8081/user/me');
                commit('SET_USER', response.data);

                if (state.currentRoute === '/login' || state.currentRoute === '/') {
                    await router.push('/home');
                } else {
                    await router.push(state.currentRoute);
                }
            } catch (error) {
                console.error(error);
            }
        }
    },
    getters: {
        isAuthenticated(state) {
            return !!state.user;
        },
        user(state) {
            return state.user;
        },
    }
});
