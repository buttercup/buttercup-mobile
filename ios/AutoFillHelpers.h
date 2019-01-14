//
//  AutoFillHelpers.h
//  Buttercup
//
//  Created by Jacob Morris on 5/1/19.
//

/**
 * Copyright (c) 2017-present, Buttercup, Inc.
 *
 * This source code is licensed under the GNU GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
