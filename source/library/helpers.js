export function getDomain(url) {
    return url.match(/(https?:\/\/)?([a-z0-9.-]+)/i)[2] || "";
}

export function prepareURLForLaunch(url) {
    if (/^https?:\/\//i.test(url) === false) {
        return `https://${url}`;
    }
    return url;
}

function simpleCloneArray(arr) {
    return arr.map(el => {
        if (Array.isArray(el)) {
            return simpleCloneArray(el);
        } else if (el && typeof el === "object") {
            return simpleCloneObject(el);
        }
        return el;
    });
}

export function simpleCloneObject(obj) {
    return Object.keys(obj).reduce((output, key) => {
        if (Array.isArray(obj[key])) {
            output[key] = simpleCloneArray(obj[key]);
        } else if (obj[key] && typeof obj[key] === "object") {
            output[key] = simpleCloneObject(obj[key]);
        } else {
            output[key] = obj[key];
        }
        return output;
    }, {});
}
