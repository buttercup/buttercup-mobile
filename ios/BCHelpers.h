#import <Foundation/Foundation.h>

@interface BCHelpers : NSObject

+ (NSString*)base64FromData:(NSData*)data;
+ (char *)characterArrayFromHexString:(NSString *)hexString;
+ (BOOL)constantTimeCompare:(NSString *)reference toChallenger:(NSString *)challenger;
+ (NSData *)dataFromBase64:(NSString *)b64;
+ (NSData *)dataFromHexString:(NSString *)string;
+ (NSString *)hexStringFromData:(NSData *)data;

@end
