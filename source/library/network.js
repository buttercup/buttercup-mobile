const FETCH_TIMEOUT_SEC = 15;

const reactNativeFetch = fetch;

export function smartFetch(...args) {
    let timeoutResolver,
        timeout;
    return Promise
        .all([
            reactNativeFetch(...args).then(res => {
                clearTimeout(timeout);
                timeoutResolver();
                return res;
            }),
            new Promise((resolve, reject) => {
                timeoutResolver = resolve;
                timeout = setTimeout(() => {
                    reject(new Error(`Network request failed: Timed-out after ${FETCH_TIMEOUT_SEC} seconds`));
                }, FETCH_TIMEOUT_SEC * 1000);
            })
        ])
        .then(results => results[0]);
}
