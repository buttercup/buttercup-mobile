import { createStateObject } from "obstate";
import { VaultSourceID } from "buttercup";

export const VAULT = createStateObject<{
    currentSource: VaultSourceID | null;
}>({
    currentSource: null
});
