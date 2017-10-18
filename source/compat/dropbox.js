import { smartFetch } from "../library/network.js";

const DOWNLOAD_URL = "https://content.dropboxapi.com/2/files/download";
const UPLOAD_URL = "https://content.dropboxapi.com/2/files/upload";

export function getArchiveContents(filePath, token) {
    const fetchOptions = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Dropbox-API-Arg": JSON.stringify({
                path: filePath
            })
        }
    };
    return smartFetch(DOWNLOAD_URL, fetchOptions).then(res => res.text());
}

export function putArchiveContents(filePath, textContents, token) {
    const buff = new Buffer(textContents, "utf8");
    const fetchOptions = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/octet-stream",
            "Dropbox-API-Arg": JSON.stringify({
                path: filePath,
                mode: "overwrite"
            })
        },
        body: buff
    };
    return smartFetch(UPLOAD_URL, fetchOptions);
}
