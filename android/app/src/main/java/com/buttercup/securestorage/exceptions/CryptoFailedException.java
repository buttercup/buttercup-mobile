package com.buttercup.securestorage.exceptions;

/**
 * Taken from https://github.com/oyyq99999/react-native-secure-storage
 */

public class CryptoFailedException extends Exception {

    public CryptoFailedException(String message) {
        super(message);
    }

    public CryptoFailedException(String message, Throwable t) {
        super(message, t);
    }
}
