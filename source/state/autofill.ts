import { createStateObject } from "obstate";
import { VaultSourceID } from "buttercup";
import { IntermediateEntry } from "../types";

export const AUTOFILL = createStateObject<{
    entries: Record<VaultSourceID, Array<IntermediateEntry>>;
}>({
    entries: {}
});
