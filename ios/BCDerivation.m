#import "BCDerivation.h"
#import "BCHelpers.h"
#import <CommonCrypto/CommonKeyDerivation.h>

@implementation BCDerivation

+ (NSString *)deriveKeyFromPassword:(NSString *)password andSalt:(NSString *)salt forRounds:(int)rounds withBits:(int)bits {
    int bytes = bits / 8;
    NSData *passwordData = [password dataUsingEncoding:NSUTF8StringEncoding];
    NSData *saltData = [salt dataUsingEncoding:NSUTF8StringEncoding];
    unsigned char key[bytes];
    CCKeyDerivationPBKDF(kCCPBKDF2, [passwordData bytes], [passwordData length], [saltData bytes], [saltData length], kCCPRFHmacAlgSHA256, rounds, key, bytes);
    return [BCHelpers hexStringFromData:[NSData dataWithBytes:key length:bytes]];
}

@end
