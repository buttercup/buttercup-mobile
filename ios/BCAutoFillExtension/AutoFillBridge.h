//
//  AutoFillBridgeDelegate.h
//  Buttercup
//
//  Created by Jacob Morris on 6/1/19.
//

#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#else
#import "RCTBridgeModule.h"
#endif

#import <AuthenticationServices/AuthenticationServices.h>

@interface AutoFillBridge : NSObject <RCTBridgeModule>
@property (nonatomic, strong) ASCredentialProviderExtensionContext *extensionContext;
- (instancetype)initWithExtensionContext:(ASCredentialProviderExtensionContext *)extensionContext;
@end
