import { createAction } from "redux-actions";
import { AUTOFILL_SET_CONTEXT, AUTOFILL_SET_URLS, AUTOFILL_SET_IDENTITY } from "./types.js";

export const setIsContextAutoFill = createAction(AUTOFILL_SET_CONTEXT);
export const setAutoFillURLs = createAction(AUTOFILL_SET_URLS);
export const setAutoFillIdentity = createAction(AUTOFILL_SET_IDENTITY);
