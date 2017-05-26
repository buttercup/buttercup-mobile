import {
    ActionConst
} from "react-native-router-flux";

const INITIAL = {
    scene: {}
};

export default function routesReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        // focus action is dispatched when a new screen comes into focus
        case ActionConst.FOCUS:
            return {
                ...state,
                scene: action.scene,
            };

        default:
            return state;
    }
}
