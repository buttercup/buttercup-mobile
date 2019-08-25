package com.buttercup.autofill;

/**
 * Helper Class for passing Buttercup Entry credentials around
 *
 * se1exin - 9/2/19
 */

public class AutoFillEntry {
    private String username;
    private String password;
    private String entryPath;

    public AutoFillEntry(String username, String password, String entryPath) {
        this.username = username;
        this.password = password;
        this.entryPath = entryPath;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEntryPath() {
        return entryPath;
    }

    public void setEntryPath(String entryPath) {
        this.entryPath = entryPath;
    }
}
