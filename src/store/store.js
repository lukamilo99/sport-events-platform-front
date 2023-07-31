import { createStore } from 'vuex';
import user from './user';
import notification from './notification'
import event from './event'

export const store = createStore({
    modules: {
        user,
        event,
        notification
    }
});