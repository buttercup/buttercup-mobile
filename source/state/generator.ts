import { createState } from "@hookstate/core";

export enum GeneratorMode {
    EntryProperty = "entryProperty",
    Standalone = "standalone"
}

export const GENERATOR_MODE = createState<GeneratorMode>(GeneratorMode.Standalone);
export const LAST_PASSWORD = createState<string>("");
