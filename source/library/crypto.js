import { NativeModules, Platform } from "react-native";
import { Buffer } from "buffer";
import { tools, vendor, Web } from "buttercup/dist/buttercup-web.min.js";
import { encode as toBase64, decode as fromBase64 } from "base-64";
import { addToStack, getStackCount, getStackItem } from "./cache.js";
import { Uint8Array } from "./polyfill/typedArrays.js";

const { CryptoBridge, Crypto } = NativeModules;

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
    return Crypto.decryptText(
        encryptedComponents.content,
        keyDerivationInfo.key.toString("hex"),
        encryptedComponents.iv,
        encryptedComponents.salt,
        keyDerivationInfo.hmac.toString("hex"),
        encryptedComponents.hmac
    ).then(decryptedBase64 => new Buffer(decryptedBase64, "base64").toString("utf8"));
}

export function deriveKeyNatively(password, salt, rounds, bits) {
    return Crypto.pbkdf2(password, salt, rounds, bits).then(derivedKeyHex =>
        hexKeyToBuffer(derivedKeyHex)
    );
}

function internalEncrypt(text, keyDerivationInfo) {
    const encodedText = Platform.select({
        ios: new Buffer(text, "utf8").toString("base64"),
        android: toBase64(encodeURIComponent(text))
    });

    return Crypto.encryptText(
        encodedText,
        keyDerivationInfo.key.toString("hex"),
        keyDerivationInfo.salt,
        keyDerivationInfo.hmac.toString("hex")
    ).then(res => {
        const [encryptedContent, hmac, iv, salt] = res.split("$");
        return {
            hmac,
            iv,
            salt,
            rounds: keyDerivationInfo.rounds,
            encryptedContent
        };
    });
}

export function fetchUUIDs() {
    return Crypto.generateUUIDs(CACHE_UUID_MIN).then(res => res.split(","));
}

export function generateSalt(length) {
    return Crypto.generateSaltWithLength(length);
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
        deriveKeyNatively(password, salt, rounds, bits)
    );
}
