//
//  BCCryptoExportTests.m
//  ButtercupTests
//
//  Created by Perry Mitchell on 12/10/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <XCTest/XCTest.h>
#import "BCCrypto.h"

@interface BCCryptoExportTests : XCTestCase

@end

@implementation BCCryptoExportTests

//- (void)testExportEncryptedText {
//    NSLog(@"HAI");
//    NSString *key = @"6955657270654438517b534d363f577a6d2b35376a32745047656f7128764547";
//    NSString *hmacKey = @"794f6f45794c7b6642495443684241643f7a475f56303e364555326a5d3e5d6e";
//    NSString *salt = @"69793971452b6754";
//    NSString *encrypted = [BCCrypto encryptText:@"my target text" withKey:key andSalt:salt andHMAC:hmacKey];
//    NSLog(@"Encrypted content: %@", encrypted);
//}

- (void)testDecryptsAndroidEncryptedContent {
    NSString *importString = @" 1x^^\\ \t\n +Hey@..!ä";
    NSString *key = @"6955657270654438517b534d363f577a6d2b35376a32745047656f7128764547";
    NSString *hmacKey = @"794f6f45794c7b6642495443684241643f7a475f56303e364555326a5d3e5d6e";
    // Props
    NSString *encryptedText = @"z/pi/m1KEVX8b7lG0TmCL3hMhqsKPmbtC9rKaPeE06g=";
    NSString *hmacOut = @"5c0b2aef0ffe95c1ff78a1ce97f7e96932a629d7490ec80f5bfca878f4b04ed1";
    NSString *ivOut = @"4959795b4e443c2d2e743d74334a2a3d";
    NSString *saltOut = @"69793971452b6754";
    // Decrypt
    NSString *decrypted = [BCCrypto decryptText:encryptedText withKey:key andIV:ivOut andSalt:saltOut andHMACKey:hmacKey andHMAC:hmacOut];
    // Test
    XCTAssert([decrypted isEqualToString:importString]);
}



@end
