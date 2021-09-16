import { EntryID, VaultSourceID, VaultSourceStatus } from "buttercup";

export { FSItem } from "@buttercup/file-interface";

export interface DatasourceConfig {
    endpoint?: string;
    password?: string;
    path?: string;
    type: string;
    username?: string;
}

export interface IntermediateEntry {
    id: EntryID;
    title: string;
    username: string;
    password: string;
    urls: Array<string>;
}

export interface IntermediateVault {
    id: VaultSourceID;
    name: string;
    type: string;
}

export interface VaultContentsItem {
    id: string;
    title: string;
    type: "entry" | "group";
}

export interface VaultDetails {
    id: VaultSourceID;
    name: string;
    state: VaultSourceStatus;
    order: number;
    type: string;
}

export interface VaultChooserItem extends VaultChooserPath {
    size?: number;
    type?: "file" | "directory";
    parent?: VaultChooserPath | null;
}

export interface VaultChooserPath {
    identifier: string;
    name: string;
}
