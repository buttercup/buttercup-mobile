#import "CryptoBindings.h"
#import "CryptoBridge.h"
#import "BCHelpers.h"
#include <sys/sysctl.h>
#import <React/RCTLog.h>

#import "Crypto.h"

@implementation Crypto

+ (NSString *)decryptText:(NSString *)text usingKey:(NSString *)keyHex andSalt:(NSString *)salt andIV:(NSString *)ivHex andHMACKey:(NSString *)hmacKeyHex andHMAC:(NSString *)hmacHex {
    const char* decryptedText = decrypt_cbc(
        [text UTF8String],
        [keyHex UTF8String],
        [ivHex UTF8String],
        [salt UTF8String],
        [hmacKeyHex UTF8String],
        [hmacHex UTF8String]
    );
    if (decryptedText == NULL) {
        return @"Error:Failed decrypting content";
    }
    NSString *output = [NSString stringWithUTF8String:decryptedText];
    dealloc_memory(decryptedText);
    return output;
}

+ (NSString *)encryptText:(NSString *)text usingKey:(NSString *)keyHex andSalt:(NSString *)salt andIV:(NSString *)ivHex andHMACKey:(NSString *)hmacKeyHex {
    const char* encryptedText = encrypt_cbc(
        [text UTF8String],
        [keyHex UTF8String],
        [salt UTF8String],
        [ivHex UTF8String],
        [hmacKeyHex UTF8String]
    );
    NSString *output = [NSString stringWithUTF8String:encryptedText];
    dealloc_memory(encryptedText);
    return output;
}

+ (NSString *)generateIVWithLength:(int)length {
    const char* iv = generate_random_bytes(length);
    NSString *output = [NSString stringWithUTF8String:iv];
    dealloc_memory(iv);
    return output;
}

+ (NSString *)generateSaltWithLength:(int)length {
    const char* salt = generate_salt(length);
    NSString *output = [NSString stringWithUTF8String:salt];
    dealloc_memory(salt);
    return output;
}

+ (NSString *)generateUUIDs:(int)count {
    const char* uuidList = generate_uuid_list(count);
    NSString *output = [NSString stringWithUTF8String:uuidList];
    dealloc_memory(uuidList);
    return output;
}

+ (NSString *)pbkdf2UsingPassword:(NSString *)password andSalt:(NSString *)salt andIterations:(int)iterations andBits:(int)bits {
    const char* keyDerivationInfo = pbkdf2_derive(
        [password UTF8String],
        [salt UTF8String],
        iterations,
        bits
    );
    NSString *output = [NSString stringWithUTF8String:keyDerivationInfo];
    dealloc_memory(keyDerivationInfo);
    return output;
}

@end
