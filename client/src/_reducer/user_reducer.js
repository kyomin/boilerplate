import { LOGIN_USER } from '../_actions/types';

// (이전 상태, action)
export default function (state={}, action) {
    switch(action.type) {
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload }
            break;

        default:
            return state
    }
}