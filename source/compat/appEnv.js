import { gzip, ungzip } from "pako";
import { createClient } from "webdav";
import * as base64 from "base64-js";
import { getSharedAppEnv } from "../library/buttercupCore.js";
import { getPatchedCrypto, getUUID } from "./crypto.js";

let __hasInitialised = false,
    __derivationRoundsOverride = null;

/**
 * Compress text using GZIP
 * @param {String} text The text to compress
 * @returns {String} Compressed text
 */
function compressV1(text) {
    return gzip(text, {
        level: 9,
        to: "string"
    });
}

function compressV2(text) {
    return Promise.resolve().then(() => {
        const output = gzip(text, {
            level: 9
        });
        return bytesToBase64(output);
    });
}

function decodeBase64(b64: string, raw: boolean = false): string | Uint8Array {
    return raw ? base64.toByteArray(b64) : new TextDecoder().decode(base64.toByteArray(b64));
}

/**
 * Decompress a compressed string (GZIP)
 * @param {String} text The compressed text
 * @returns {String} Decompressed text
 */
function decompressV1(text) {
    return ungzip(text, { to: "string" });
}

function decompressV2(text) {
    return Promise.resolve().then(() => {
        const bytes = decodeBase64(text, true);
        return ungzip(bytes, { to: "string" });
    });
}

function decryptData(data, password) {
    const session = getPatchedCrypto();
    return session.decrypt(data, password);
}

function encodeBytesToBase64(bytes: Uint8Array): string {
    return base64.fromByteArray(bytes);
}

function encodeTextToBase64(text: string): string {
    return encodeBytesToBase64(new TextEncoder().encode(text));
}

function encryptData(data, password) {
    const session = getPatchedCrypto();
    if (__derivationRoundsOverride > 0) {
        session.setDerivationRounds(__derivationRoundsOverride);
    }
    return session.encrypt(data, password);
}

export function initButtercupCore() {
    if (__hasInitialised) return;
    __hasInitialised = true;
    // Setup app env
    const appEnv = getSharedAppEnv();
    // Apply methods
    appEnv.setProperties({
        "compression/v1/compressText": compressV1,
        "compression/v1/decompressText": decompressV1,
        "compression/v2/compressText": compressV2,
        "compression/v2/decompressText": decompressV2,
        "crypto/v1/decryptBuffer": decryptData,
        "crypto/v1/encryptBuffer": encryptData,
        "crypto/v1/decryptText": decryptData,
        "crypto/v1/encryptText": encryptData,
        "crypto/v1/setDerivationRounds": setDerivationRounds,
        "encoding/v1/base64ToBytes": input => decodeBase64(input, true),
        "encoding/v1/base64ToText": decodeBase64,
        "encoding/v1/bytesToBase64": encodeBytesToBase64,
        "encoding/v1/textToBase64": encodeTextToBase64,
        "env/v1/isClosedEnv": () => true,
        "net/webdav/v1/newClient": createClient,
        "rng/v1/uuid": getUUID
    });
}

function setDerivationRounds(rounds = null) {
    __derivationRoundsOverride = rounds;
}
