import { createState } from "@hookstate/core";
import { VaultSourceID } from "buttercup";
import { IntermediateEntry } from "../types";

export const LOGIN_ENTRIES = createState<Record<VaultSourceID, Array<IntermediateEntry>>>({} as Record<VaultSourceID, Array<IntermediateEntry>>);
