package com.buttercup;

import com.facebook.react.bridge.Promise;

public class MockPromise implements Promise {
    public String resolvedValue;
    public String rejectedValue;
    public String result;

    public MockPromise() {
        resolvedValue = null;
        rejectedValue = null;
        result = null;
    }

    public void resolve(String value) {
        result = "resolved";
        resolvedValue = value;
    }

    public void resolve(Object obj) {
        System.out.println("resolve(Object) not implemented");
    }

    public void reject(String reason) {
        result = "rejected";
        rejectedValue = reason;
    }

    public void reject(Throwable reason) {
        System.out.println("reject(Throwable) not implemented");
    }

    public void reject(String code, Throwable e) {
        System.out.println("reject(String, Throwable) not implemented");
    }

    public void reject(String code, String message, Throwable e) {
        System.out.println("reject(String, String, Throwable) not implemented");
    }

    public void reject(String code, String message) {
        System.out.println("reject(String, String) not implemented");
    }
}
