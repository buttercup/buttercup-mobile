export function getDomain(url) {
    return url.match(/(https?:\/\/)?([a-z0-9.-]+)/i)[2] || "";
}
