import { NativeModules, Platform } from "react-native";
import { Buffer } from "buffer";
import { tools, vendor, Web } from "./buttercupCore.js";
import { addToStack, getStackCount, getStackItem } from "./cache.js";
import { Uint8Array } from "./polyfill/typedArrays.js";

const { iocane: { configure: configureIocane } } = vendor;
const { Crypto } = NativeModules;

const CACHE_UUID_MAX = 500;
const CACHE_UUID_MIN = 50;

function cacheUUIDs() {
    const uuidCount = getStackCount("uuid");
    if (uuidCount > CACHE_UUID_MIN) {
        return Promise.resolve();
    }
    console.log("Will fetch more UUIDs");
    const refill = () => {
        return fetchUUIDs().then(uuids => {
            console.log(`Received ${uuids.length} UUIDs...`);
            addToStack("uuid", ...uuids);
            const uuidCount = getStackCount("uuid");
            if (uuidCount < CACHE_UUID_MAX) {
                return refill();
            }
        });
    };
    return refill();
}

function internalDecrypt(encryptedComponents, keyDerivationInfo) {
    return Crypto.decryptText(
        encryptedComponents.content,
        keyDerivationInfo.key.toString("hex"),
        encryptedComponents.iv,
        encryptedComponents.salt,
        keyDerivationInfo.hmac.toString("hex"),
        encryptedComponents.auth
    ).then(decryptedBase64 => new Buffer(decryptedBase64, "base64").toString("utf8"));
}

function deriveKeyNatively(password, salt, rounds, bits) {
    return Crypto.pbkdf2(password, salt, rounds, bits).then(
        derivedKeyHex => new Buffer(derivedKeyHex, "hex")
    );
}

function internalEncrypt(text, keyDerivationInfo, generatedIV) {
    const encodedText = Platform.select({
        ios: new Buffer(text, "utf8").toString("base64"),
        android: new Buffer(encodeURIComponent(text), "utf8").toString("base64")
    });

    return Crypto.encryptText(
        encodedText,
        keyDerivationInfo.key.toString("hex"),
        keyDerivationInfo.salt,
        generatedIV.toString("hex"),
        keyDerivationInfo.hmac.toString("hex")
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

function fetchUUIDs() {
    return Crypto.generateUUIDs(CACHE_UUID_MIN).then(res => res.split(","));
}

function generateSalt(length) {
    return Crypto.generateSaltWithLength(length);
}

function generateIV() {
    return Crypto.generateIV().then(res => new Buffer(res, "hex"));
}

function getUUID() {
    return getStackItem("uuid");
}

export function buildCache() {
    return Promise.all([cacheUUIDs()]);
}

export function patchCrypto() {
    configureIocane()
        .use("cbc")
        .overrideEncryption("cbc", internalEncrypt)
        .overrideDecryption("cbc", internalDecrypt)
        .overrideSaltGeneration(generateSalt)
        .overrideIVGeneration(generateIV)
        .overrideKeyDerivation(deriveKeyNatively);
    tools.uuid.setUUIDGenerator(() => getUUID());
}
