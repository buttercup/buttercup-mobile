package com.buttercup;

import java.util.Random;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import javax.crypto.Mac;

/**
 * Created by perry on 10/10/17.
 */

public class BCCrypto {

    private static final int IV_BYTE_LEN = 16;
    private static final String RANDOM_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXZY0123456789!@#$%^&*(){}[]<>,.?~|-=_+";

    public static String decryptText(String encryptedText, String keyHex, String ivHex, String saltHex, String hmacKeyHex, String hmacHex) {
        byte[] encryptedData = Base64.getDecoder().decode(encryptedText.getBytes(StandardCharsets.UTF_8));
        byte[] keyData = BCHelpers.hexStringToByteArray(keyHex);
        byte[] ivData = BCHelpers.hexStringToByteArray(ivHex);
        byte[] saltData = BCHelpers.hexStringToByteArray(saltHex);
        byte[] hmacKeyData = BCHelpers.hexStringToByteArray(hmacKeyHex);
        IvParameterSpec iv = new IvParameterSpec(ivData);
        SecretKeySpec skeySpec = new SecretKeySpec(keyData, "AES");
        // AES decryption
        try {
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);
            byte[] decrypted = cipher.doFinal(encryptedData);
            String decryptedText = new String(decrypted, "UTF8");
            return decryptedText;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    public static String encryptText(String text, String keyHex, String saltHex, String hmacHexKey) {
        String ivHex = generateIV();
        byte[] ivData = BCHelpers.hexStringToByteArray(ivHex);
        byte[] keyData = BCHelpers.hexStringToByteArray(keyHex);
        byte[] hmacKeyData = BCHelpers.hexStringToByteArray(hmacHexKey);
        IvParameterSpec iv = new IvParameterSpec(ivData);
        SecretKeySpec skeySpec = new SecretKeySpec(keyData, "AES");
        try {
            // AES encryption
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);
            byte[] encrypted = cipher.doFinal(text.getBytes());
            byte[] encodedEncryptedText = Base64.getEncoder().encode(encrypted);
            String encryptedText = new String(encodedEncryptedText);
            // HMAC
            Mac sha256HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec hmacSecretKey = new SecretKeySpec(hmacKeyData, "HmacSHA256");
            sha256HMAC.init(hmacSecretKey);
            String hmacTarget = encryptedText + ivHex + saltHex;
            byte[] hmacData = sha256HMAC.doFinal(hmacTarget.getBytes(StandardCharsets.UTF_8));
            String hmacHex = BCHelpers.byteArrayToHexString(hmacData);
            // Output
            return encryptedText + "|" + hmacHex + "|" + ivHex + "|" + saltHex;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return "";
    }

    public static String generateIV() {
        // Use salt to generate the hex
        return generateSalt(IV_BYTE_LEN * 2);
    }

    public static String generateRandomString(int length) {
        StringBuilder randomString = new StringBuilder();
        Random rnd = new Random();
        while (randomString.length() < length) { // length of the random string.
            int index = (int) (rnd.nextFloat() * RANDOM_CHARS.length());
            randomString.append(RANDOM_CHARS.charAt(index));
        }
        return randomString.toString();
    }

    public static String generateSalt(int length) {
        String randomText = generateRandomString(length * 2);
        String hex = String.format("%040x", new BigInteger(1, randomText.getBytes(StandardCharsets.UTF_8)));
        return hex.substring(0, length).toLowerCase();
    }

    public static String generateUUID() {
        UUID newID = UUID.randomUUID();
        return newID.toString();
    }

    public static String[] generateUUIDs(int count) {
        String[] uuids = new String[count];
        for (int i = 0; i < count; i += 1) {
            uuids[i] = generateUUID();
        }
        return uuids;
    }

}
