export function addBCUPExtension(filePath) {
    if (/\.bcup$/i.test(filePath) === false) {
        return `${filePath}.bcup`;
    }
    return filePath;
}

export function joinPathAndFilename(directory, filename) {
    return `${directory}/${filename}`.replace(/\/{2,}/, "/");
}
