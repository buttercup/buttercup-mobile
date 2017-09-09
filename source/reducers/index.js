import { combineReducers } from "redux";
import archives from "./archives.js";
import archiveContents from "./archiveContents.js";
import nav from "./nav.js";
import addArchive from "./addArchive.js";
import remoteExplorer from "./remoteExplorer.js";
import entry from "./entry.js";
import app from "./app.js";
import dropbox from "./dropbox.js";
import browser from "./browser.js";

const rootReducer = combineReducers({
    addArchive,
    app,
    archiveContents,
    archives,
    browser,
    dropbox,
    entry,
    nav,
    remoteExplorer
});

export default rootReducer;
