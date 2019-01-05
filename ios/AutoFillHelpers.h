//
//  AutoFillHelpers.h
//  Buttercup
//
//  Created by Jacob Morris on 5/1/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <AuthenticationServices/AuthenticationServices.h>
#import <Security/Security.h>
#import <LocalAuthentication/LAContext.h>

@interface AutoFillHelpers : NSObject

+ (bool) deviceSupportsAutoFill;
+ (NSDictionary *) buildKeychainQuery;
+ (NSDictionary *) getAutoFillEntries;
+ (NSError *)setAutoFillEntries:(NSDictionary *)autoFillEntries;
+ (void) updateASCredentialIdentityStore:(NSDictionary *)autoFillEntries;
+ (ASPasswordCredential *) getAutoFillPasswordCredential:(ASPasswordCredentialIdentity *)credentialIdentity;

@end
