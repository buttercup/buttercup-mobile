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
