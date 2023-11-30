import { createStateObject } from "obstate";

export enum GeneratorMode {
    EntryProperty = "entryProperty",
    Standalone = "standalone"
}

export const GENERATOR = createStateObject<{
    lastPassword: string;
    mode: GeneratorMode;
}>({
    lastPassword: "",
    mode: GeneratorMode.Standalone
});
