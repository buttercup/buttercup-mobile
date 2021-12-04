interface BasicObject {
    [key: string]: any;
}

function cloneArray(arr: Array<any>): Array<any> {
    return arr.map(
        item => Array.isArray(item)
            ? cloneArray(item)
            : (item && typeof item === "object") ? cloneObject(item) : item
    );
}

export function cloneObject<T extends BasicObject>(obj: T): T {
    const output: T = {} as T;
    for (const key in obj) {
        if (Array.isArray(obj[key])) {
            output[key] = cloneArray(obj[key]) as any;
        } else if (obj[key] && typeof obj[key] === "object") {
            output[key] = cloneObject(obj[key]);
        } else {
            output[key] = obj[key];
        }
    }
    return output;
}
