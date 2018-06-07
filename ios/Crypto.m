#import "CryptoBindings.h"
#import "Crypto.h"
#import <React/RCTLog.h>
#include <sys/sysctl.h>

@implementation Crypto

// The React Native bridge needs to know our module
RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

RCT_EXPORT_METHOD(pbkdf2:(NSString*)password:(NSString*)salt:(int)iterations:(int)bytes:(RCTResponseSenderBlock)callback) {
    const char* utf8String = pbkdf2_derive([password cStringUsingEncoding:NSUTF8StringEncoding], [salt cStringUsingEncoding:NSUTF8StringEncoding], iterations, bytes);
    RCTLogInfo(@"Pretending to create an event %@ %@ %d %d %@", password, salt, iterations, bytes, [NSString stringWithFormat:@"%s", utf8String]);
    callback(@[[NSNull null], [NSString stringWithFormat:@"%s", utf8String]]);
}

@end
