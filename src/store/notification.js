export default {
    state: {
        notifications: []
    },
    mutations: {
        ADD_NOTIFICATION(state, notification) {
            state.notifications.push(notification);
        },
        REMOVE_NOTIFICATION(state, notificationToRemove) {
            state.notifications = state.notifications.filter(
                notification => notification !== notificationToRemove
            );
        }
    },
    actions: {
        addNotification({ commit }, notification) {
            commit('ADD_NOTIFICATION', notification);
        },
        removeNotification({ commit }, notification) {
            commit('REMOVE_NOTIFICATION', notification);
        }
    },
    getters: {
        notifications: state => state.notifications
    }
};
