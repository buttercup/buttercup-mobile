package com.buttercup;

import java.nio.charset.StandardCharsets;
import org.spongycastle.crypto.PBEParametersGenerator;
import org.spongycastle.crypto.generators.PKCS5S2ParametersGenerator;
import org.spongycastle.crypto.digests.SHA256Digest;
import org.spongycastle.crypto.params.KeyParameter;

public class BCDerivation {

    private final static char[] HEX_CHARS = "0123456789abcdef".toCharArray();

    public static String deriveKeyFromPassword(String password, String salt, int rounds) {
        char[] passwordData = password.toCharArray();
        byte[] saltData = salt.getBytes(StandardCharsets.UTF_8);
        PKCS5S2ParametersGenerator generator = new PKCS5S2ParametersGenerator(new SHA256Digest());
        generator.init(PBEParametersGenerator.PKCS5PasswordToUTF8Bytes(passwordData), saltData, rounds);
        KeyParameter key = (KeyParameter)generator.generateDerivedMacParameters(64 * 8);
        return hexStringFromData(key.getKey());
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

}
