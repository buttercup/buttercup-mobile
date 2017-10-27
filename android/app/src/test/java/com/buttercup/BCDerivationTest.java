package com.buttercup;

import com.buttercup.BCDerivation;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by perry on 9/10/17.
 */
public class BCDerivationTest {

    public static final String PASSWORD = "mySecretPassw0rd";
    public static final int ROUNDS = 212032;
    public static final String SALT = "#j8P.3Fv9";

    @Before
    public void setUp() throws Exception {

    }

    @Test
    public void deriveKeyFromPassword_producesKey() throws Exception {
        String key = BCDerivation.deriveKeyFromPassword(PASSWORD, SALT, ROUNDS);
        assertEquals("a133417d43bef4317d99ee14b20868173e42cead20d874d394c7ba6a075e8a15dc6f2fb83625c96d76c6adb7eb85f2502bca4d2052a41b050a337680b601457b", key);
    }

}