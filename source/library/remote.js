import test, {
    createWebDAVAdapter,
    createAnyFSAdapter
} from "@buttercup/mobile-compat";

const PATH_ABS = /^\//;
const PATH_PARENT = /^\.\.$/;

export function getWebDAVConnection(remoteURL, username, password) {
    const webdavFs = username ?
        createWebDAVAdapter(remoteURL, username, password) :
        createWebDAVAdapter(remoteURL);
    return testRemoteFSConnection(webdavFs)
        .then(() => createAnyFSAdapter(webdavFs));
}

export function joinRemotePath(base, join) {
    console.log("JOIN", base, join);
    // if (PATH_ABS.test(base) !== true) {
    //     throw new Error(`Invalid path (expected absolute): ${base}`);
    // }
    const baseParts = base.split("\/");
    const output = [...baseParts, join]
        .join("/")
        .replace(/\/{2,}/, "/")
        .replace(/\/$/, "");
    return /^\//.test(output) ?
        output :
        `/${output}`;
    // const baseParts = base.split("\/");
    // if (PATH_PARENT.test(join)) {
    //     baseParts.pop();
    // } else {
    //     const appendItem = PATH_ABS.test(join) ?
    //         join.substr(1) :
    //         join;
    //     if (appendItem.length > 0) {
    //         baseParts.push(appendItem);
    //     }
    // }
    // if (baseParts.length <= 0 || baseParts[0] !== "") {
    //     baseParts.unshift("");
    // }
    // return baseParts.join("/");
}

export function testRemoteFSConnection(fsInstance) {
    return new Promise(function __testFSWithStat(resolve, reject) {
        fsInstance.readdir("/", function __handleStatResponse(err, stat) {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
}
