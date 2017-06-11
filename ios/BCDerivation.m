//
//  BCDerivation.m
//  TestCrypto
//
//  Created by Perry Mitchell on 23/5/17.
//  Copyright © 2017 Perry Mitchell. All rights reserved.
//

#import "BCDerivation.h"
#import <CommonCrypto/CommonKeyDerivation.h>

@implementation BCDerivation

int const IV_BYTE_LEN = 16;

+ (NSString *)deriveKeyFromPassword:(NSString *)password andSalt:(NSString *)salt forRounds:(int)rounds {
    NSData *passwordData = [password dataUsingEncoding:NSUTF8StringEncoding];
    NSData *saltData = [salt dataUsingEncoding:NSUTF8StringEncoding];
    unsigned char key[64];
    CCKeyDerivationPBKDF(kCCPBKDF2, [passwordData bytes], [passwordData length], [saltData bytes], [saltData length], kCCPRFHmacAlgSHA256, rounds, key, 64);
    return [BCDerivation hexStringFromData:[NSData dataWithBytes:key length:64]];
}

+ (NSString *)generateIV {
    return [BCDerivation generateSaltWithLength:IV_BYTE_LEN];
}

+ (NSString *)generateSaltWithLength:(int)length {
    unsigned char salt[length];
    for (int i = 0; i < length; i += 1) {
        salt[i] = (unsigned char)arc4random();
    }
    return [BCDerivation hexStringFromData:[NSData dataWithBytes:salt length:length]];
}

+ (NSString *)hexStringFromData:(NSData *)data {
    const unsigned char *dataBuffer = (const unsigned char *)[data bytes];
    if (!dataBuffer) {
        return [NSString string];
    }
    NSUInteger dataLength = [data length];
    NSMutableString *hexString = [NSMutableString stringWithCapacity:(dataLength * 2)];
    for (int i = 0; i < dataLength; i += 1) {
        [hexString appendString:[NSString stringWithFormat:@"%02lx", (unsigned long)dataBuffer[i]]];
    }
    return [NSString stringWithString:hexString];
}

@end
