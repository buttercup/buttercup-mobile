package com.buttercup;

import java.util.Random;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;

/**
 * Created by perry on 10/10/17.
 */

public class BCCrypto {

    public static final int IV_BYTE_LEN = 16;
    public static final String RANDOM_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXZY0123456789!@#$%^&*(){}[]<>,.?~|-=_+";

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

}
