import { createStore } from 'vuex';
import user from './user';
import notification from './notification'

export const store = createStore({
    modules: {
        user,
        notification
    }
});