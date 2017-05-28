import { combineReducers } from "redux";
import archives from "./archives.js";
import routes from "./routes.js";
import addArchive from "./addArchive.js";

const rootReducer = combineReducers({
    addArchive,
    archives,
    routes
});

export default rootReducer;
