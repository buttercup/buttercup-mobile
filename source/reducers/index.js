import { combineReducers } from "redux";
import archives from "./archives.js";
import routes from "./routes.js";

const rootReducer = combineReducers({
    archives,
    routes
});

export default rootReducer;
