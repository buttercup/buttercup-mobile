package com.buttercup;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import android.support.test.runner.AndroidJUnit4;

import static org.junit.Assert.*;

@RunWith(AndroidJUnit4.class)
public class CryptoTest {
    private static final String PASSWORD = "mySecretPassw0rd";
    private static final int ROUNDS = 212032;
    private static final String SALT = "#j8P.3Fv9";
    private static final int BITS = 512;

    private Crypto crypto;

    @Before
    public void setUp() throws Exception {
        System.out.println(System.getProperty(("java.library.path")));
        Crypto crypto = new Crypto(null);
    }

    @Test
    public void pbkdf2_derivesKey() throws Exception {
        String targetOutcome = "a133417d43bef4317d99ee14b20868173e42cead20d874d394c7ba6a075e8a15dc6f2fb83625c96d76c6adb7eb85f2502bca4d2052a41b050a337680b601457b";
        MockPromise mp = new MockPromise();
        crypto.pbkdf2(PASSWORD, SALT, ROUNDS, BITS, mp);
        assertEquals("resolved", mp.result);
        assertEquals(targetOutcome, mp.resolvedValue);
    }
}