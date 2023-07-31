export default {
    state: {
        event: {
            name: '',
            capacity: null,
            sport: '',
            location: {
                formatted: '',
                coordinates: [45.2671, 19.8335]
            },
            date: null
        }
    },
    mutations: {
        SET_EVENT(state, event) {
            state.event = event;
        },
        RESET_EVENT(state) {
            state.event = {
                name: '',
                capacity: null,
                sport: '',
                location: {
                    formatted: '',
                    coordinates: [45.2671, 19.8335]
                },
                date: null
            };
        }
    },
    actions: {
        selectEvent({ commit }, event) {
            commit('SET_EVENT', event);
        },
        deselectEvent({ commit }) {
            commit('RESET_EVENT');
        }
    },
    getters: {
        event: state => state.event
    }
};
