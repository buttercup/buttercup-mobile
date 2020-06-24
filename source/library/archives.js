import { formatArchiveTypeTitle } from "./format.js";

export function getArchiveTypeDetails() {
    return [
        {
            type: "mybuttercup",
            title: formatArchiveTypeTitle("mybuttercup"),
            image: require("../../resources/images/bcup-256.png"),
            available: true
        },
        {
            type: "dropbox",
            title: formatArchiveTypeTitle("dropbox"),
            image: require("../../resources/images/dropbox-256.png"),
            available: true
        },
        {
            type: "googledrive",
            title: formatArchiveTypeTitle("googledrive"),
            image: require("../../resources/images/googledrive-256.png"),
            available: true
        },
        {
            type: "webdav",
            title: formatArchiveTypeTitle("webdav"),
            image: require("../../resources/images/webdav-256.png"),
            available: true
        },
        {
            type: "owncloud",
            title: formatArchiveTypeTitle("owncloud"),
            image: require("../../resources/images/owncloud-256.png"),
            available: false
        },
        {
            type: "nextcloud",
            title: formatArchiveTypeTitle("nextcloud"),
            image: require("../../resources/images/nextcloud-256.png"),
            available: false
        }
    ];
}
