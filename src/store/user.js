import axios from 'axios';
import router from "@/router/router";

export default {
    state: {
        user: null,
        currentRoute: '/',
        userLocation: ''
    },
    mutations: {
        SET_USER(state, user) {
            state.user = user;
        },
        SET_CURRENT_ROUTE(state, route) {
            state.currentRoute = route;
        },
        SET_USER_LOCATION(state, userLocation) {
            state.userLocation = userLocation;
        }
    },
    actions: {
        async register(_, credentials) {
            await axios.post('http://localhost:8081/auth/register', credentials);
        },
        async login(_, credentials) {
            const response = await axios.post(`http://localhost:8081/auth/login`, credentials);
            if (response.data) {
                localStorage.setItem('jwt', response.data);
            }
        },
        async googleLogin() {
            window.location.href = 'http://localhost:8081/oauth2/authorize/google?redirect_uri=http://localhost:8080/oauth2/redirect';
        },
        async logout({ commit }) {
            localStorage.removeItem('jwt');
            localStorage.removeItem('userLocation')
            commit('SET_USER', null);
            commit('SET_USER_LOCATION', '');
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
        },
        async getUserLocation({ commit }) {
            if(localStorage.getItem("userLocation")) {
                commit('SET_USER_LOCATION', localStorage.getItem("userLocation"));
                return;
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async position => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    try {
                        const response = await axios.get('http://localhost:8081/geo/address',
                            { params: { lat, lon } })
                        commit('SET_USER_LOCATION', response.data.city);
                        localStorage.setItem('userLocation', response.data.city);
                    } catch (error) {
                        console.error("Error fetching location details from server:", error);
                    }
                }, error => {
                    console.error("Error getting location:", error);
                });
            } else {
                console.error("Geolocation is not supported by this browser.");
            }
        }

    },
    getters: {
        user: state => state.user,
        userId: state => state.user ? state.user.id : null,
        userRole: state => state.user ? state.user.role : null,
        currentRoute: state => state.currentRoute,
        userLocation: state => state.userLocation
    }
};

