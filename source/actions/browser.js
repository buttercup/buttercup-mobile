import { createAction } from "redux-actions";
import {
    BROWSER_SET_URL
} from "./types.js";

export const setBrowserURL =                    createAction(BROWSER_SET_URL);
