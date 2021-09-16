import { createState } from "@hookstate/core";
import { IntermediateEntry } from "../types";

export const LOGIN_ENTRIES = createState<Array<IntermediateEntry>>([] as Array<IntermediateEntry>);
