package com.buttercup;

import java.nio.charset.StandardCharsets;
import org.spongycastle.crypto.PBEParametersGenerator;
import org.spongycastle.crypto.generators.PKCS5S2ParametersGenerator;
import org.spongycastle.crypto.digests.SHA256Digest;
import org.spongycastle.crypto.params.KeyParameter;

public class BCDerivation {

    public static String deriveKeyFromPassword(String password, String salt, int rounds, int bits) {
        char[] passwordData = password.toCharArray();
        byte[] saltData = salt.getBytes(StandardCharsets.UTF_8);
        PKCS5S2ParametersGenerator generator = new PKCS5S2ParametersGenerator(new SHA256Digest());
        generator.init(PBEParametersGenerator.PKCS5PasswordToUTF8Bytes(passwordData), saltData, rounds);
        KeyParameter key = (KeyParameter)generator.generateDerivedMacParameters(bits); // 64 * 8 = 512 bit
        return BCHelpers.byteArrayToHexString(key.getKey());
    }

}
