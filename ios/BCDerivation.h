#import <Foundation/Foundation.h>

@interface BCDerivation : NSObject

+ (NSString *)deriveKeyFromPassword:(NSString *)password andSalt:(NSString *)salt forRounds:(int)rounds withBits:(int)bits;

@end
