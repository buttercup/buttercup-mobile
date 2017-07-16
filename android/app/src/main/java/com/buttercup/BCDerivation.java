package com.buttercup;

import java.util.Random;
import java.nio.charset.StandardCharsets;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.SecretKeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

public class BCDerivation {

    private final static char[] HEX_CHARS = "0123456789ABCDEF".toCharArray();
    private final static int IV_BYTE_LEN = 16;
    private final static String PBKDF2_ALGORITHM = "PBKDF2withHmacSHA256";

    public static String deriveKeyFromPassword(String password, String salt, int rounds)
        throws InvalidKeySpecException, NoSuchAlgorithmException
    {
//        byte[] passwordData = password.getBytes(StandardCharsets.UTF_8);
        char[] passwordData = password.toCharArray();
        byte[] saltData = salt.getBytes(StandardCharsets.UTF_8);
//        char[] key = new char[64];
        byte[] key = pbkdf2(passwordData, saltData, rounds, 64);
        return hexStringFromData(key);
    }

    public static String generateSaltWithLength(int length) {
        Random rand = new Random();
        byte[] buffer = new byte[length];
        rand.nextBytes(buffer);
        return hexStringFromData(buffer);
    }

    private static String hexStringFromData(byte[] buffer) {
        char[] hexString = new char[buffer.length * 2];
        for (int j = 0; j < buffer.length; j += 1) {
            int v = buffer[j] & 0xFF;
            hexString[j * 2] = HEX_CHARS[v >>> 4];
            hexString[j * 2 + 1] = HEX_CHARS[v & 0x0F];
        }
        return new String(hexString);
    }

    /**
     * Computes the PBKDF2 hash of a password.
     * Taken from this gist: https://gist.github.com/jtan189/3804290
     * @param   password    the password to hash.
     * @param   salt        the salt
     * @param   iterations  the iteration count (slowness factor)
     * @param   bytes       the length of the hash to compute in bytes
     * @return              the PBDKF2 hash of the password
     */
    private static byte[] pbkdf2(char[] password, byte[] salt, int iterations, int bytes)
        throws NoSuchAlgorithmException, InvalidKeySpecException
    {
        PBEKeySpec spec = new PBEKeySpec(password, salt, iterations, bytes * 8);
        SecretKeyFactory skf = SecretKeyFactory.getInstance(PBKDF2_ALGORITHM);
        return skf.generateSecret(spec).getEncoded();
    }

}
