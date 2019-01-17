//
//  AutoFillHelpers.m
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

#import "AutoFillHelpers.h"

@implementation AutoFillHelpers

NSString *authenticationPrompt = @"";
NSString *key = @"pw.buttercup.mobile.autofillstore";
NSString *service = @"pw.buttercup.mobile.autofillstore";
NSString *accessGroup = @"group.pw.buttercup.mobile";

+ (bool) deviceSupportsAutoFill
{
    if (@available(iOS 12.0, *)) {
        return true;
    }
    return false;
}

+ (NSDictionary *) buildKeychainQuery
{
    return @{
             (__bridge NSString *)kSecClass: (__bridge id)(kSecClassGenericPassword),
             (__bridge NSString *)kSecAttrService: service,
             (__bridge NSString *)kSecAttrAccount: key,
             (__bridge NSString *)kSecReturnAttributes: (__bridge id)kCFBooleanTrue,
             (__bridge NSString *)kSecReturnData: (__bridge id)kCFBooleanTrue,
             (__bridge NSString *)kSecUseOperationPrompt: authenticationPrompt,
             };
}

+ (NSDictionary *) getAutoFillEntries
{
    NSDictionary *emptyDictionary = [[NSDictionary alloc] init];

    NSDictionary *query = [self buildKeychainQuery];

    // Look up service in the keychain
    NSDictionary *found = nil;
    CFTypeRef foundTypeRef = NULL;
    OSStatus osStatus = SecItemCopyMatching((__bridge CFDictionaryRef) query, (CFTypeRef*)&foundTypeRef);

    if (osStatus != noErr && osStatus != errSecItemNotFound) {
        return emptyDictionary; // Return an empty dictionary if errors are encountered
    }

    found = (__bridge NSDictionary*)(foundTypeRef);
    if (!found) {
        return emptyDictionary; // Return an empty dictionary if nothing is found
    }

    // Grab the JSON encoded value and decode into a dictionary
    NSError *jsonError;
    NSString *value = [[NSString alloc] initWithData:[found objectForKey:(__bridge id)(kSecValueData)] encoding:NSUTF8StringEncoding];
    NSData *objectData = [value dataUsingEncoding:NSUTF8StringEncoding];

    NSDictionary *json = [NSJSONSerialization JSONObjectWithData:objectData
                                                         options:NSJSONReadingMutableContainers
                                                           error:&jsonError];

    // Return the valid JSON Dictionary, or the empty dictionary if deserialization failed
    return (!json ? emptyDictionary : json);
}

+ (NSError *)setAutoFillEntries:(NSDictionary *)autoFillEntries
{
    // Convert the Dictionary to a String
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:autoFillEntries
                                                       options:(NSJSONWritingOptions)0
                                                         error:&error];
    if (! jsonData) {
        return error;
    }

    NSString *value = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];

    // First try to delete any existing entries
    NSDictionary *query = [self buildKeychainQuery];
    SecItemDelete((__bridge CFDictionaryRef) query);

    // Now try to save to keychain again
    CFStringRef accessible = kSecAttrAccessibleWhenUnlocked;
    SecAccessControlCreateFlags accessControl = kSecAccessControlTouchIDAny|kSecAccessControlOr|kSecAccessControlDevicePasscode;

    NSDictionary *attributes = @{
                                 (__bridge NSString *)kSecClass: (__bridge id)(kSecClassGenericPassword),
                                 (__bridge NSString *)kSecAttrService: service,
                                 (__bridge NSString *)kSecAttrAccount: key,
                                 (__bridge NSString *)kSecAttrAccessGroup: accessGroup,
                                 (__bridge NSString *)kSecValueData: [value dataUsingEncoding:NSUTF8StringEncoding],
                                 };

    NSMutableDictionary *mAttributes = attributes.mutableCopy;

    if (accessControl) {
        NSError *aerr = nil;
        BOOL canAuthenticate = [[LAContext new] canEvaluatePolicy:LAPolicyDeviceOwnerAuthentication error:&aerr];
        if (aerr || !canAuthenticate) {
            return false;
        }

        CFErrorRef error = NULL;
        SecAccessControlRef sacRef = SecAccessControlCreateWithFlags(kCFAllocatorDefault,
                                                                     accessible,
                                                                     accessControl,
                                                                     &error);

        if (error) {
            return aerr;
        }
        mAttributes[(__bridge NSString *)kSecAttrAccessControl] = (__bridge id)sacRef;
    } else {
        mAttributes[(__bridge NSString *)kSecAttrAccessible] = (__bridge id)accessible;
    }

    attributes = [NSDictionary dictionaryWithDictionary:mAttributes];

    OSStatus osStatus = SecItemAdd((__bridge CFDictionaryRef) attributes, NULL);

    if (osStatus != noErr && osStatus != errSecItemNotFound) {
        NSError *error = [NSError errorWithDomain:NSOSStatusErrorDomain code:osStatus userInfo:nil];
        return error;
    } else {
        return nil;
    }
}

+ (void) updateASCredentialIdentityStore:(NSDictionary *)autoFillEntries
{
    if ([self deviceSupportsAutoFill]) {
        // Iterate the entries and add them to the ASCredentialIdentityStore
        ASCredentialIdentityStore *store = [ASCredentialIdentityStore sharedStore];

        NSMutableArray *credentialIdenties = [[NSMutableArray alloc] init];

        // Iterate the each Source in the autoFillEntries object
        [autoFillEntries enumerateKeysAndObjectsUsingBlock:^(NSString* sourceID, NSDictionary* childEntries, BOOL* outerStop) {
            // Then iterate each child entrie of the source to create the final ASCredentialServiceIdentifier
            [childEntries enumerateKeysAndObjectsUsingBlock:^(NSString* entryID, NSDictionary* entry, BOOL* innerStop) {
                // Create the service identifier for the entry

                // Set the record identifier based on the Source and Entry IDs so we can easily map back to this entry
                // Format: sourceID:entryID
                NSString *recordIdentifier = [NSString stringWithFormat:@"%@:%@", sourceID, entryID];
                NSString *username = [entry valueForKey:@"username"];

                if (username != nil && ![username isEqualToString:@""]) {
                    // Add a service identifier for every URL associated with the Entry
                    NSArray *urls = [entry objectForKey:@"urls"];
                    if (urls != nil) {
                        [urls enumerateObjectsUsingBlock:^(id url, NSUInteger indes, BOOL *stop) {
                            if (url != nil && ![url isEqualToString:@""]) { // Sanity check for valid URL string
                                // Finally, create the CredentialIdentity and add it to be saved to the store.
                                ASCredentialServiceIdentifier *serviceIdentifier = [[ASCredentialServiceIdentifier alloc]
                                                                                    initWithIdentifier:url
                                                                                    type:ASCredentialServiceIdentifierTypeURL];

                                ASPasswordCredentialIdentity *identity = [[ASPasswordCredentialIdentity alloc]
                                                                          initWithServiceIdentifier:serviceIdentifier
                                                                          user:username
                                                                          recordIdentifier:recordIdentifier];

                                [credentialIdenties addObject:identity];
                            }
                        }];
                    }
                }
            }];
        }];
        [store replaceCredentialIdentitiesWithIdentities:credentialIdenties completion:nil];
    } else {
        // Device is not iOS 12+ Do nothing as AutoFill is not available.
    }
}

/**
 * Take a ASPasswordCredentialIdentity try to reverse match a Buttercup credential using the ASPasswordCredentialIdentity recordIdentifier
 */
+ (ASPasswordCredential *) getAutoFillPasswordCredential:(ASPasswordCredentialIdentity *)credentialIdentity
 API_AVAILABLE(ios(12.0)) {
     // Obtain the Source ID and Entry ID from the recordIdentifier
    NSArray *identifierParts = [[credentialIdentity recordIdentifier] componentsSeparatedByString:@":"];
    if ([identifierParts count] == 2) { // Check that the split was successful
        NSDictionary *autoFillEntries = [self getAutoFillEntries];

        NSString *sourceID = identifierParts[0];
        NSString *entryID = identifierParts[1];

        // Check for a matching Buttercup entry
        if (autoFillEntries[sourceID] && autoFillEntries[sourceID][entryID]) {
            // Final check that username and password are present
            NSString *username = autoFillEntries[sourceID][entryID][@"username"];
            NSString *password = autoFillEntries[sourceID][entryID][@"password"];
            if (username != nil && password != nil) {
                return [[ASPasswordCredential alloc] initWithUser:username password:password];
            }
        }
    }
    // Could not match a Buttercup entry..
    return nil;
}

@end
