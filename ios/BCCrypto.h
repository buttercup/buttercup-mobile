//
//  BCCrypto.h
//  Buttercup
//
//  Created by Perry Mitchell on 29/8/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

extern int const IV_BYTE_LEN;

@interface BCCrypto : NSObject

+ (NSString *)decryptText:(NSString *)encryptedText withKey:(NSString *)key andIV:(NSString *)ivHex andSalt:(NSString *)saltHex andHMACKey:(NSString *)hmacHexKey andHMAC:(NSString *)hmacHex;
+ (NSString *)encryptText:(NSString *)text withKey:(NSString *)key andSalt:(NSString *)salt andHMAC:(NSString *)hmacHexKey;
+ (NSString *)generateIVHex;
+ (NSString *)generateRandomStringWithLength:(int)length;
+ (NSString *)generateSaltWithLength:(int)length;
+ (NSString *)generateUUID;
+ (NSArray *)generateUUIDsForCount:(int)count;

@end
