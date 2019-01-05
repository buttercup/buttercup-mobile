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

/*
 * Inject our RN JS UI into the ViewController
 */
-(void)viewDidLoad {
    [super viewDidLoad];
    
    NSURL *jsCodeLocation;
    
    // @TODO: Replace with dedicated RN UI instead of showing the main application.
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
    NSLog(@"%@", serviceIdentifiers);
}

/*
 * Attempt to match an identity tapped in the QuickBar to a Buttercup Entry
 */
 - (void)provideCredentialWithoutUserInteractionForIdentity:(ASPasswordCredentialIdentity *)credentialIdentity
 {
     ASPasswordCredential *matchingCredential = [AutoFillHelpers getAutoFillPasswordCredential:credentialIdentity];
     if (matchingCredential != nil) {
         [self.extensionContext completeRequestWithSelectedCredential:matchingCredential completionHandler:nil];
     } else {
         // Failed to find matching Buttercup entry.. send the user to the UI to choose a credential manually
         [self.extensionContext cancelRequestWithError:[NSError errorWithDomain:ASExtensionErrorDomain code:ASExtensionErrorCodeUserInteractionRequired userInfo:nil]];
     }
 }
 

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
