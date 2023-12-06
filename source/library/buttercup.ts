import { EntryType } from "buttercup";
import { deepFreeze } from "./freeze";
import ICON_DROPBOX from "../../resources/images/dropbox-256.png";
import ICON_GOOGLEDRIVE from "../../resources/images/googledrive-256.png";
import ICON_LOCAL from "../../resources/images/localfile-512.png";
import ICON_WEBDAV from "../../resources/images/webdav-256.png";

interface VaultType {
    title: string;
    icon: any;
    enabled: boolean;
}

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
    mobilelocalfile: {
        title: "Local",
        icon: ICON_LOCAL,
        enabled: true
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
