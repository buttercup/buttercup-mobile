import { NativeModules } from "react-native";
import {
    Archive,
    ArchiveManager,
    TextDatasource,
    createCredentials,
    Web
} from "buttercup-web";

const { CryptoBridge } = NativeModules;
const { LocalStorageInterface } = Web;
const { SourceStatus: ArchiveSourceStatus } = ArchiveManager;

let __sharedManager = null;

export function createNewArchive() {
    return Archive.createWithDefaults();
}

export function deriveKeyNatively(password, salt, rounds) {
    const callBridge = (new Promise(function(resolve, reject) {
        CryptoBridge.deriveKeyFromPassword(password, salt, rounds, (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    }));
    return callBridge
        .then(function __mapHexToBuff(derivedKeyHex) {
            return hexKeyToBuffer(derivedKeyHex);
        });
}

export function getArchiveEncryptedContent(archive, credentials) {
    const tds = new TextDatasource();
    return tds.save(archive, credentials);
}

export function getSharedArchiveManager() {
    if (__sharedManager === null) {
        __sharedManager = new ArchiveManager(new LocalStorageInterface());
    }
    return __sharedManager;
}

export function hexKeyToBuffer(key) {
    let hexKey = key;
    const hexArr = [];
    while (hexKey.length > 0) {
        const piece = hexKey.substr(0, 2);
        hexKey = hexKey.substr(2);
        hexArr.push(piece);
    }
    const intArr = Uint8Array.from(hexArr, function(byte) {
        return parseInt(byte, 16);
    });
    const buff = intArr.buffer;
    // fix broken things
    buff.length = intArr.length;
    const oldToString = buff.toString;
    buff.toString = function(mode) {
        if (mode === "hex") {
            return key;
        }
        return oldToString.call(buff, mode);
    };
    return buff;
}

export function patchKeyDerivation() {
    Web.HashingTools.patchCorePBKDF(
        (password, salt, rounds, bits /* , algorithm */) =>
            deriveKeyNatively(password, salt, rounds)
    );
}

export {
    ArchiveSourceStatus
};
