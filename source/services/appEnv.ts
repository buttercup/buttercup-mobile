import { gzip, ungzip } from "pako";
import { WebDAVClient, WebDAVClientOptions, createClient } from "webdav";
import { DropboxClient } from "@buttercup/dropbox-client";
import * as base64 from "base64-js";
import { getSharedAppEnv } from "buttercup";
import {
    HMAC_KEY_SIZE,
    PASSWORD_KEY_SIZE,
    DerivedKeyInfo,
    EncryptedComponents,
    EncryptedBinaryComponents,
    EncryptionAlgorithm,
    IocaneAdapter,
    createAdapter
} from "iocane/web";
import uuid from "react-native-uuid";
import hexToArrayBuffer from "hex-to-array-buffer";
import arrayBufferToHex from "array-buffer-to-hex";
import { DROPBOX_CLIENT_CONFIG } from "./dropbox";
import { CryptoBridge } from "./cryptoBridge";
import { CRYPTO_DERIVATION_ROUNDS } from "../symbols";

interface TextDecoderClass {
    new ();
    decode: (data: Uint8Array) => string;
}

interface TextEncoderClass {
    new ();
    encode: (text: string) => string;
}

declare var TextDecoder: TextDecoderClass;
declare var TextEncoder: TextEncoderClass;

const NOOP = () => {};

let __hasInitialised = false,
    __derivationRoundsOverride = CRYPTO_DERIVATION_ROUNDS;

function compressV1(text: string): string {
    return gzip(text, {
        level: 9,
        to: "string"
    });
}

async function compressV2(text: string): Promise<string> {
    const output = gzip(text, {
        level: 9
    });
    return encodeBytesToBase64(output);
}

function decodeBase64(b64: string, raw: boolean = false): string | Uint8Array {
    return raw ? base64.toByteArray(b64) : new TextDecoder().decode(base64.toByteArray(b64));
}

function decompressV1(text: string): string {
    return ungzip(text, { to: "string" });
}

async function decompressV2(text: string): Promise<string> {
    const bytes = decodeBase64(text, true);
    return ungzip(bytes, { to: "string" });
}

export async function decryptCBC(
    encryptedComponents: EncryptedComponents | EncryptedBinaryComponents,
    keyDerivationInfo: DerivedKeyInfo
): Promise<string | ArrayBuffer> {
    if (typeof encryptedComponents.content === "string") {
        const result = await CryptoBridge.decryptText(
            encryptedComponents.content,
            arrayBufferToHex(keyDerivationInfo.key),
            encryptedComponents.iv,
            encryptedComponents.salt,
            arrayBufferToHex(keyDerivationInfo.hmac),
            encryptedComponents.auth
        );
        return decodeBase64(result);
    }
    throw new Error("Binary mode not supported yet");
}

function decryptData(data: Buffer | string, password: string): Promise<Buffer | string> {
    const adapter = getAdapter();
    return adapter.decrypt(data, password);
}

export async function deriveKey(password: string, salt: string): Promise<DerivedKeyInfo> {
    const bits = (PASSWORD_KEY_SIZE + HMAC_KEY_SIZE) * 8;
    const derivedKeyHex = await CryptoBridge.deriveKeyFromPassword(
        password,
        salt,
        this.derivationRounds,
        bits
    );
    const dkhLength = derivedKeyHex.length;
    const keyBuffer = hexToArrayBuffer(derivedKeyHex.substr(0, dkhLength / 2));
    const hmacBuffer = hexToArrayBuffer(derivedKeyHex.substr(dkhLength / 2, dkhLength / 2));
    return {
        salt,
        key: keyBuffer,
        rounds: this.derivationRounds,
        hmac: hmacBuffer
    };
}

function encodeBytesToBase64(bytes: Uint8Array): string {
    return base64.fromByteArray(bytes);
}

function encodeTextToBase64(text: string): string {
    return encodeBytesToBase64(new TextEncoder().encode(text));
}

async function encryptCBC(
    content: string | ArrayBuffer,
    keyDerivationInfo: DerivedKeyInfo,
    iv: ArrayBuffer
): Promise<EncryptedComponents | EncryptedBinaryComponents> {
    if (typeof content === "string") {
        const ivHex = arrayBufferToHex(iv);
        const preparedContent = encodeTextToBase64(content);
        const result = await CryptoBridge.encryptText(
            preparedContent,
            arrayBufferToHex(keyDerivationInfo.key),
            keyDerivationInfo.salt,
            ivHex,
            arrayBufferToHex(keyDerivationInfo.hmac)
        );
        const [encryptedContent, hmacHex, , saltHex] = result.split("|");
        const output: EncryptedComponents = {
            content: encryptedContent,
            auth: hmacHex,
            iv: ivHex,
            salt: saltHex,
            rounds: keyDerivationInfo.rounds,
            method: EncryptionAlgorithm.CBC
        };
        return output;
    }
    throw new Error("Binary mode not supported yet");
}

function encryptData(data: Buffer | string, password: string): Promise<Buffer | string> {
    const adapter = getAdapter();
    return adapter.encrypt(data, password);
}

async function generateIV(): Promise<ArrayBuffer> {
    const ivStr = await CryptoBridge.generateIV();
    return hexToArrayBuffer(ivStr);
}

async function generateSalt(length: number): Promise<string> {
    return CryptoBridge.generateSaltWithLength(length);
}

function generateUUID(): string {
    return uuid.v4() as string;
}

export function getAdapter(): IocaneAdapter {
    const adapter = createAdapter();
    patchCrypto(adapter);
    if (__derivationRoundsOverride !== null) {
        adapter.setDerivationRounds(__derivationRoundsOverride);
    }
    return adapter;
}

function createPreparedWebDAVClient(remoteURL: string, options: WebDAVClientOptions): WebDAVClient {
    return createClient(remoteURL, {
        ...options,
        headers: {
            ...(options?.headers ?? {}),
            "Cache-Control": "no-store, no-cache"
        }
    });
}

export function initAppEnv() {
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
        "crypto/v2/decryptBuffer": decryptData, // @todo
        "crypto/v2/encryptBuffer": encryptData, // @todo
        "crypto/v1/decryptText": decryptData,
        "crypto/v1/encryptText": encryptData,
        "crypto/v1/setDerivationRounds": NOOP,
        "encoding/v1/base64ToBytes": (input: string) => decodeBase64(input, true),
        "encoding/v1/base64ToText": decodeBase64,
        "encoding/v1/bytesToBase64": encodeBytesToBase64,
        "encoding/v1/textToBase64": encodeTextToBase64,
        "env/v1/isClosedEnv": () => true,
        "net/dropbox/v1/newClient": (token: string) =>
            new DropboxClient(token, { ...DROPBOX_CLIENT_CONFIG }),
        "net/webdav/v1/newClient": createPreparedWebDAVClient,
        "rng/v1/uuid": generateUUID
    });
}

function patchCrypto(adapter: IocaneAdapter) {
    Object.assign(adapter, {
        decryptCBC,
        deriveKey: deriveKey.bind(adapter),
        encryptCBC,
        generateIV,
        generateSalt
    });
}
