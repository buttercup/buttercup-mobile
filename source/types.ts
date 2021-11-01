import { EntryID, EntryType, GroupID, PropertyKeyValueObject, VaultSourceID, VaultSourceStatus } from "buttercup";
import {
    ReactChild,
    ReactChildren
} from "react";

export { FSItem } from "@buttercup/file-interface";

export type ChildElements = ReactChild | ReactChildren | Array<ReactChild> | Array<ReactChildren>;

export interface DatasourceConfig {
    endpoint?: string;
    password?: string;
    path?: string;
    token?: string;
    type: string;
    username?: string;
}

export interface IntermediateEntry {
    id: EntryID;
    title: string;
    username: string;
    password: string;
    entryPath: string;
    urls: Array<string>;
}

export interface IntermediateVault {
    id: VaultSourceID;
    name: string;
    type: string;
    authToken?: string;
}

export interface OTPCode extends OTP {
    id: string;
    currentCode: string;
    otpTitle: string;
    period: number;
    timeLeft: number;
    valid: boolean;
}

export interface OTP {
    sourceID: VaultSourceID;
    entryID: EntryID;
    entryProperty: string;
    entryTitle: string;
    otpURL: string;
}

export type StoredAutofillEntries = Record<EntryID, IntermediateEntry>;

export interface VaultContentsItem {
    id: string;
    title: string;
    type: "entry" | "group";
    groupID?: GroupID;
    entryType?: EntryType;
    entryProperties?: PropertyKeyValueObject;
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
