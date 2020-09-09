import { NativeModules, Platform } from "react-native";
import { Buffer } from "buffer";
import VError from "verror";
import { createSession } from "iocane/web";
import { decodeBase64String, encodeBase64String } from "../library/buttercupCore.js";
import { addToStack, getStackCount, getStackItem } from "../library/cache.js";
import { ERROR_CODE_DECRYPT_ERROR } from "../global/symbols.js";

const { CryptoBridge: Crypto } = NativeModules;

const BRIDGE_ERROR_REXP = /^Error:/i;
const CACHE_UUID_MAX = 5000;
const CACHE_UUID_MIN = 2500;
const CACHE_UUID_REFILL = 150;
const IV_LENGTH = 16; // Bytes

function bufferToHex(buff) {
    return Array.prototype.map
        .call(new Uint8Array(buff), x => ("00" + x.toString(16)).slice(-2))
        .join("");
}

export function buildCache() {
    return Promise.all([cacheUUIDs()]);
}

function cacheUUIDs() {
    const uuidCount = getStackCount("uuid");
    if (uuidCount > CACHE_UUID_MIN) {
        return Promise.resolve();
    }
    console.log("Fetching more UUIDs...");
    const refill = () =>
        fetchUUIDs().then(uuids => {
            console.log(`Received ${uuids.length} UUIDs...`);
            addToStack("uuid", ...uuids);
            const uuidCount = getStackCount("uuid");
            if (uuidCount < CACHE_UUID_MAX) {
                return refill();
            }
        });
    return refill();
}

function fetchUUIDs() {
    return Crypto.generateUUIDs(CACHE_UUID_REFILL).then(res => res.split(","));
}

function generateSalt(length) {
    return Crypto.generateSaltWithLength(length);
}

function generateIV() {
    return Crypto.generateIV(IV_LENGTH).then(res => new Buffer(res, "hex"));
}

export function getPatchedCrypto() {
    return createSession()
        .use("cbc")
        .overrideEncryption("cbc", internalEncrypt)
        .overrideDecryption("cbc", internalDecrypt)
        .overrideSaltGeneration(generateSalt)
        .overrideIVGeneration(generateIV)
        .overridePBKDF2(pbkdf2);
}

export function getUUID() {
    const uuid = getStackItem("uuid");
    if (!uuid) {
        throw new Error("No pre-generated UUIDs available");
    }
    return uuid;
}

function internalDecrypt(encryptedComponents, keyDerivationInfo) {
    return Crypto.decryptText(
        encryptedComponents.content,
        bufferToHex(keyDerivationInfo.key),
        encryptedComponents.iv,
        encryptedComponents.salt,
        bufferToHex(keyDerivationInfo.hmac),
        encryptedComponents.auth
    )
        .then(content => {
            if (BRIDGE_ERROR_REXP.test(content)) {
                const errMsg = content.replace(BRIDGE_ERROR_REXP, "");
                throw new VError({ info: { code: ERROR_CODE_DECRYPT_ERROR } }, errMsg);
            }
            return content;
        })
        .then(decryptedBase64 => decodeBase64String(decryptedBase64));
}

function internalEncrypt(text, keyDerivationInfo, generatedIV) {
    return Crypto.encryptText(
        encodeBase64String(text),
        bufferToHex(keyDerivationInfo.key),
        keyDerivationInfo.salt,
        generatedIV.toString("hex"),
        bufferToHex(keyDerivationInfo.hmac)
    ).then(res => {
        const [content, auth, iv, salt] = res.split("$");
        return {
            auth,
            iv,
            salt,
            rounds: keyDerivationInfo.rounds,
            content
        };
    });
}

function pbkdf2(password, salt, rounds, bits) {
    return Crypto.pbkdf2(password, salt, rounds, bits).then(
        derivedKeyHex => new Buffer(derivedKeyHex, "hex")
    );
}
