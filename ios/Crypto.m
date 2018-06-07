#import "CryptoBindings.h"
#import "Crypto.h"
#import <React/RCTLog.h>
#include <sys/sysctl.h>
#import "BCHelpers.h"

@implementation Crypto

// The React Native bridge needs to know our module
RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

RCT_EXPORT_METHOD(pbkdf2:(NSString*)password:(NSString*)salt:(int)iterations:(int)bits:(RCTPromiseResolveBlock)resolve:(RCTPromiseRejectBlock)reject) {
    const char* utf8String = pbkdf2_derive([password cStringUsingEncoding:NSUTF8StringEncoding], [salt cStringUsingEncoding:NSUTF8StringEncoding], iterations, bits);
    if (utf8String) {
        resolve([BCHelpers hexStringFromData:[NSData dataWithBytes:utf8String length:bits/8]]);
    } else {
        NSError *error = [NSError init];
        reject(@"pbkdf2_failed", @"Key Derivation failed.", error);
    }
}

@end
