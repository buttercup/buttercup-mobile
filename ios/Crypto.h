//
//  Crypto.h
//  Buttercup
//
//  Created by Perry Mitchell on 15/7/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Crypto : NSObject

+ (NSString *)decryptText:(NSString *)text usingKey:(NSString *)keyHex andSalt:(NSString *)salt andIV:(NSString *)ivHex andHMACKey:(NSString *)hmacKeyHex andHMAC:(NSString *)hmacHex;
+ (NSString *)encryptText:(NSString *)text usingKey:(NSString *)keyHex andSalt:(NSString *)salt andIV:(NSString *)ivHex andHMACKey:(NSString *)hmacKeyHex;
+ (NSString *)generateIVWithLength:(int)length;
+ (NSString *)generateSaltWithLength:(int)length;
+ (NSString *)generateUUIDs:(int)count;
+ (NSString *)pbkdf2UsingPassword:(NSString *)password andSalt:(NSString *)salt andIterations:(int)iterations andBits:(int)bits;

@end
