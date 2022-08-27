package com.buttercup.securestorage.exceptions;

/**
 * Taken from https://github.com/oyyq99999/react-native-secure-storage
 */

public class KeyStoreAccessException extends Exception {

    public KeyStoreAccessException(String message, Throwable t) {
        super(message, t);
    }

}
