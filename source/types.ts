import {
    DatasourceConfiguration,
    DatasourceConfigurationDropbox,
    DatasourceConfigurationGoogleDrive,
    DatasourceConfigurationWebDAV,
    EntryID,
    EntryType,
    GroupID,
    PropertyKeyValueObject,
    VaultSourceID,
    VaultSourceStatus
} from "buttercup";
import {
    ReactChild,
    ReactChildren
} from "react";

export type ChildElements = ReactChild | ReactChildren | Array<ReactChild> | Array<ReactChildren>;

export interface DatasourceConfigurationMobileLocalFile extends DatasourceConfiguration {
    filename: string;
}

export type DatasourceConfig = DatasourceConfigurationDropbox | DatasourceConfigurationGoogleDrive | DatasourceConfigurationWebDAV | DatasourceConfigurationMobileLocalFile | {
    type: string;
    [key: string]: any;
};

export interface GoogleOAuthToken {
    accessToken: string;
    expiryDate: number;
    refreshToken: string;
    tokenType: string;
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
    otpIssuer: string;
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
    otpTitle?: string;
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
    identifier: string | number;
    name: string;
}
