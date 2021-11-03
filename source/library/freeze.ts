export function deepFreeze<T extends Object>(obj: T): T {
    const output = { ...obj };
    Object.keys(output).forEach(prop => {
        if (typeof output[prop] === "object" && !Object.isFrozen(output[prop])) {
            deepFreeze(output[prop]);
        }
    });
    return Object.freeze(output);
}
