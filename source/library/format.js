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
        case "dropbox":
            return "Dropbox";
        case "googledrive":
            return "Google Drive";
        case "mybuttercup":
            return "My Buttercup";
        default:
            return type;
    }
}

export function joinPathAndFilename(directory, filename) {
    return `${directory}/${filename}`.replace(/\/{2,}/, "/");
}
