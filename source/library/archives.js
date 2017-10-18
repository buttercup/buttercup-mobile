import { formatArchiveTypeTitle } from "./format.js";

export function getArchiveTypeDetails() {
    return [
        {
            type: "dropbox",
            title: formatArchiveTypeTitle("dropbox"),
            image: require("../../resources/images/dropbox-256.png")
        },
        {
            type: "owncloud",
            title: formatArchiveTypeTitle("owncloud"),
            image: require("../../resources/images/owncloud-256.png")
        },
        {
            type: "nextcloud",
            title: formatArchiveTypeTitle("nextcloud"),
            image: require("../../resources/images/nextcloud-256.png")
        },
        {
            type: "webdav",
            title: formatArchiveTypeTitle("webdav"),
            image: require("../../resources/images/webdav-256.png")
        }
    ];
}
