import { createState } from "@hookstate/core";
import { VaultSourceID } from "buttercup";

export const CURRENT_SOURCE = createState<VaultSourceID>(null);
