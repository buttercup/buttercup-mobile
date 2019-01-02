//
//  CredentialProviderViewController.m
//  ButtercupAutoFill
//
//  Created by Jacob Morris on 30/12/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "CredentialProviderViewController.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation CredentialProviderViewController

-(void)viewDidLoad {
    [super viewDidLoad];
    
    NSURL *jsCodeLocation;
    
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
    
    RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                        moduleName:@"Buttercup"
                                                 initialProperties:nil
                                                     launchOptions:nil];
    rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
    self.view = rootView;
}

/*
 Prepare your UI to list available credentials for the user to choose from. The items in
 'serviceIdentifiers' describe the service the user is logging in to, so your extension can
 prioritize the most relevant credentials in the list.
 */
- (void)prepareCredentialListForServiceIdentifiers:(NSArray<ASCredentialServiceIdentifier *> *)serviceIdentifiers
{
}

/*
 Implement this method if your extension supports showing credentials in the QuickType bar.
 When the user selects a credential from your app, this method will be called with the
 ASPasswordCredentialIdentity your app has previously saved to the ASCredentialIdentityStore.
 Provide the password by completing the extension request with the associated ASPasswordCredential.
 If using the credential would require showing custom UI for authenticating the user, cancel
 the request with error code ASExtensionErrorCodeUserInteractionRequired.
 
 - (void)provideCredentialWithoutUserInteractionForIdentity:(ASPasswordCredentialIdentity *)credentialIdentity
 {
 BOOL databaseIsUnlocked = YES;
 if (databaseIsUnlocked) {
 ASPasswordCredential *credential = [[ASPasswordCredential alloc] initWithUser:@"j_appleseed" password:@"apple1234"];
 [self.extensionContext completeRequestWithSelectedCredential:credential completionHandler:nil];
 } else
 [self.extensionContext cancelRequestWithError:[NSError errorWithDomain:ASExtensionErrorDomain code:ASExtensionErrorCodeUserInteractionRequired userInfo:nil]];
 }
 */

/*
 Implement this method if -provideCredentialWithoutUserInteractionForIdentity: can fail with
 ASExtensionErrorCodeUserInteractionRequired. In this case, the system may present your extension's
 UI and call this method. Show appropriate UI for authenticating the user then provide the password
 by completing the extension request with the associated ASPasswordCredential.
 
 - (void)prepareInterfaceToProvideCredentialForIdentity:(ASPasswordCredentialIdentity *)credentialIdentity
 {
 }
 */

- (IBAction)cancel:(id)sender
{
    [self.extensionContext cancelRequestWithError:[NSError errorWithDomain:ASExtensionErrorDomain code:ASExtensionErrorCodeUserCanceled userInfo:nil]];
}

- (IBAction)passwordSelected:(id)sender
{
    ASPasswordCredential *credential = [[ASPasswordCredential alloc] initWithUser:@"j_appleseed" password:@"apple1234"];
    [self.extensionContext completeRequestWithSelectedCredential:credential completionHandler:nil];
}

@end
