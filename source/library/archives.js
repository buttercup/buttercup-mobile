import { formatArchiveTypeTitle } from "./format.js";

export function getArchiveTypeDetails() {
    return [
        {
            type: "mybuttercup",
            title: formatArchiveTypeTitle("mybuttercup"),
            image: require("../../resources/images/bcup-256.png")
        },
        {
            type: "dropbox",
            title: formatArchiveTypeTitle("dropbox"),
            image: require("../../resources/images/dropbox-256.png")
        },
        {
            type: "googledrive",
            title: formatArchiveTypeTitle("googledrive"),
            image: require("../../resources/images/googledrive-256.png")
        },
        {
            type: "webdav",
            title: formatArchiveTypeTitle("webdav"),
            image: require("../../resources/images/webdav-256.png")
        }
    ];
}
