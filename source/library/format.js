export function addBCUPExtension(filePath) {
    if (/\.bcup$/i.test(filePath) === false) {
        return `${filePath}.bcup`;
    }
    return filePath;
}

export function formatArchiveTypeTitle(type) {
    switch (type) {
        case "webdav":
            return "WebDAV";
        case "owncloud":
            return "ownCloud";
        case "nextcloud":
            return "Nextcloud";
        case "dropbox":
            return "Dropbox";
        case "googledrive":
            return "Google Drive";
        default:
            return type;
    }
}

export function joinPathAndFilename(directory, filename) {
    return `${directory}/${filename}`.replace(/\/{2,}/, "/");
}
