export function getDomain(url) {
    return url.match(/(https?:\/\/)?([a-z0-9.-]+)/i)[2] || "";
}

export function prepareURLForLaunch(url) {
    if (/^https?:\/\//i.test(url) === false) {
        return `https://${url}`;
    }
    return url;
}
