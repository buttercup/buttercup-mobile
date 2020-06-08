import { combineReducers } from "redux";
import { APP_MASTER_RESET } from "../actions/types.js";
import addArchive from "./addArchive.js";
import app from "./app.js";
import archiveContents from "./archiveContents.js";
import archives from "./archives.js";
import autofill from "./autofill.js";
import browser from "./browser.js";
import dropbox from "./dropbox.js";
import entry from "./entry.js";
import googleDrive from "./googleDrive.js";
import myButtercup from "./myButtercup.js";
import remoteExplorer from "./remoteExplorer.js";

const appReducer = combineReducers({
    addArchive,
    app,
    archiveContents,
    archives,
    autofill,
    browser,
    dropbox,
    entry,
    googleDrive,
    myButtercup,
    remoteExplorer
});

const rootReducer = (state, action) => {
    if (action.type === APP_MASTER_RESET) {
        // reset global state
        state = undefined;
    }
    return appReducer(state, action);
};

export default rootReducer;
