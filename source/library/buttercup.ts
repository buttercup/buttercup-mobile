import { EntryType } from "buttercup";
import { deepFreeze } from "./freeze";

interface VaultType {
    title: string;
    icon: any;
    enabled: boolean;
}

const ICON_DROPBOX = require("../../resources/images/dropbox-256.png");
const ICON_GOOGLEDRIVE = require("../../resources/images/googledrive-256.png");
const ICON_LOCAL = require("../../resources/images/localfile-512.png");
const ICON_WEBDAV = require("../../resources/images/webdav-256.png");

const INT_VAULT_TYPES: { [type: string]: VaultType } = {
    webdav: {
        title: "WebDAV",
        icon: ICON_WEBDAV,
        enabled: true
    },
    dropbox: {
        title: "Dropbox",
        icon: ICON_DROPBOX,
        enabled: true
    },
    googledrive: {
        title: "Google Drive",
        icon: ICON_GOOGLEDRIVE,
        enabled: true
    },
    local: {
        title: "Local",
        icon: ICON_LOCAL,
        enabled: false
    }
};

export const VAULT_TYPES = deepFreeze(INT_VAULT_TYPES);

export function getIconForEntryType(type: EntryType): string {
    switch (type) {
        case EntryType.CreditCard:
            return "credit-card-outline";
        case EntryType.Login:
            return "person-done-outline";
        case EntryType.Website:
            return "at-outline";
        case EntryType.Note:
            return "edit-2-outline";
        case EntryType.SSHKey:
            return "external-link-outline";
        default:
            return "file-outline";
    }
}
