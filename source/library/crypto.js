import { NativeModules, Platform } from "react-native";
import { tools, vendor, Web } from "buttercup/dist/buttercup-web.min.js";
import { encode as toBase64, decode as fromBase64 } from "base-64";
import { addToStack, getStackCount, getStackItem } from "./cache.js";
import { Uint8Array } from "./polyfill/typedArrays.js";

const { CryptoBridge } = NativeModules;

const CACHE_UUID_MAX = 500;
const CACHE_UUID_MIN = 50;

export function buildCache() {
    return Promise.all([cacheUUIDs()]);
}

function cacheUUIDs() {
    const uuidCount = getStackCount("uuid");
    if (uuidCount > CACHE_UUID_MIN) {
        return Promise.resolve();
    }
    console.log("Will fetch more UUIDs");
    const refill = () => {
        return fetchUUIDs().then(uuids => {
            console.log(`Received ${uuids.length} UUIDs...`);
            // console.log("UUIDS", uuids);
            addToStack("uuid", ...uuids);
            const uuidCount = getStackCount("uuid");
            if (uuidCount < CACHE_UUID_MAX) {
                return refill();
            }
        });
    };
    return refill();
}

function constantTimeCompare(val1, val2) {
    let sentinel;
    if (val1.length !== val2.length) {
        return false;
    }
    for (let i = 0; i <= val1.length - 1; i += 1) {
        sentinel |= val1.charCodeAt(i) ^ val2.charCodeAt(i);
    }
    return sentinel === 0;
}

function internalDecrypt(encryptedComponents, keyDerivationInfo) {
    const callBridge = new Promise(function(resolve, reject) {
        CryptoBridge.decryptText(
            encryptedComponents.content,
            keyDerivationInfo.key.toString("hex"),
            encryptedComponents.iv,
            encryptedComponents.salt,
            keyDerivationInfo.hmac.toString("hex"),
            encryptedComponents.hmac,
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (/^Error/i.test(result)) {
                    let errorMessage = "Unknown decrypt error";
                    const errorCodeMatch = /^Error=([0-9-]+)/i.exec(result);
                    const errorMessageMatch = /^Error:(.+)/i.exec(result);
                    if (errorCodeMatch) {
                        errorMessage = `Error code ${errorCodeMatch[1]}`;
                    } else if (errorMessageMatch) {
                        errorMessage = errorMessageMatch[1];
                    }
                    return reject(new Error(errorMessage));
                }
                return resolve(result);
            }
        );
    });
    return callBridge;
}

export function deriveKeyNatively(password, salt, rounds) {
    const callBridge = new Promise(function(resolve, reject) {
        CryptoBridge.deriveKeyFromPassword(password, salt, rounds, (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
    return callBridge.then(derivedKeyHex => hexKeyToBuffer(derivedKeyHex));
}

function internalEncrypt(text, keyDerivationInfo) {
    const callBridge = new Promise(function(resolve, reject) {
        const encodedText = Platform.select({
            ios: text,
            android: toBase64(encodeURIComponent(text))
        });
        CryptoBridge.encryptText(
            encodedText,
            keyDerivationInfo.key.toString("hex"),
            keyDerivationInfo.salt,
            keyDerivationInfo.hmac.toString("hex"),
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (/^Error/i.test(result)) {
                    let errorMessage = "Unknown encrypt error";
                    const errorCodeMatch = /^Error=([0-9-]+)/i.exec(result);
                    const errorMessageMatch = /^Error:((.|\n)+)/i.exec(result);
                    if (errorCodeMatch) {
                        errorMessage = `Error code ${errorCodeMatch[1]}`;
                    } else if (errorMessageMatch) {
                        errorMessage = errorMessageMatch[1];
                    }
                    return reject(new Error(errorMessage));
                }
                // Process result
                const [encryptedContent, hmac, iv, salt] = result.split("|");
                return resolve({
                    hmac,
                    iv,
                    salt,
                    rounds: keyDerivationInfo.rounds,
                    encryptedContent
                });
            }
        );
    });
    return callBridge;
}

export function fetchUUIDs() {
    const callBridge = new Promise(function(resolve, reject) {
        CryptoBridge.generateUUIDs((err, result) => {
            if (err) {
                return reject(err);
            }
            const uuids = result.split(",");
            return resolve(uuids);
        });
    });
    return callBridge;
}

export function generateSalt(length) {
    const callBridge = new Promise(function(resolve, reject) {
        CryptoBridge.generateSaltWithLength(length, (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
    return callBridge;
}

export function getUUID() {
    return getStackItem("uuid");
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

export function patchCrypto() {
    const { iocane } = vendor;
    const { overrides } = tools;
    iocane.components.setEncryptTool(internalEncrypt);
    iocane.components.setDecryptTool(internalDecrypt);
    iocane.components.setSaltGenerationTool(generateSalt);
    overrides.setUUIDGenerator(() => getUUID());
}

export function patchKeyDerivation() {
    Web.HashingTools.patchCorePBKDF((password, salt, rounds, bits /* , algorithm */) =>
        deriveKeyNatively(password, salt, rounds)
    );
}
