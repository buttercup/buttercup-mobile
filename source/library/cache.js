const cache = {};

export function addToStack(stack, ...items) {
    if (Array.isArray(cache[stack]) !== true) {
        cache[stack] = [];
    }
    cache[stack].push(...items);
}

export function getStackCount(stack) {
    return (Array.isArray(cache[stack]) !== true) ?
        0 :
        cache[stack].length;
}

export function getStackItem(stack) {
    if (Array.isArray(cache[stack]) !== true) {
        throw new Error(`Unable to get item: No items in stack '${stack}'`);
    }
    return cache[stack].shift();
}
