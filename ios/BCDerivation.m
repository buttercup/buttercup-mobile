//
//  BCDerivation.m
//  TestCrypto
//
//  Created by Perry Mitchell on 23/5/17.
//  Copyright © 2017 Perry Mitchell. All rights reserved.
//

#import "BCDerivation.h"
#import "BCHelpers.h"
#import <CommonCrypto/CommonKeyDerivation.h>

@implementation BCDerivation

+ (NSString *)deriveKeyFromPassword:(NSString *)password andSalt:(NSString *)salt forRounds:(int)rounds {
    NSData *passwordData = [password dataUsingEncoding:NSUTF8StringEncoding];
    NSData *saltData = [salt dataUsingEncoding:NSUTF8StringEncoding];
    unsigned char key[64];
    CCKeyDerivationPBKDF(kCCPBKDF2, [passwordData bytes], [passwordData length], [saltData bytes], [saltData length], kCCPRFHmacAlgSHA256, rounds, key, 64);
    return [BCHelpers hexStringFromData:[NSData dataWithBytes:key length:64]];
}

@end
