//
//  BCCryptoTests.m
//  Buttercup
//
//  Created by Perry Mitchell on 30/8/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <XCTest/XCTest.h>
#import "BCCrypto.h"

@interface BCCryptoTests : XCTestCase

@end

@implementation BCCryptoTests

- (void)setUp {
    [super setUp];
}

- (void)tearDown {
    [super tearDown];
}

- (void)testEncryptDoesNotError {
    NSString *key = @"d1de434664c6db7a2a8fdae4a6fbe83f876707b306b6c7dd2b15e518429ac08d";
    NSString *hmac = @"2684372578ce8a1b29fe6d7efd3bd4c8c8be396b238a77a8b4f785fb8e709d86";
    NSString *salt = @"some salt!";
    NSString *encrypted = [BCCrypto encryptText:@"my target text" withKey:key andSalt:salt andHMAC:hmac andRounds:192348];
    BOOL isError = [encrypted rangeOfString:@"Error"].location != NSNotFound;
    XCTAssert(!isError);
}

- (void)testEncryptContainsParts {
    NSString *key = @"d1de434664c6db7a2a8fdae4a6fbe83f876707b306b6c7dd2b15e518429ac08d";
    NSString *hmac = @"2684372578ce8a1b29fe6d7efd3bd4c8c8be396b238a77a8b4f785fb8e709d86";
    NSString *salt = @"some salt!";
    NSString *encrypted = [BCCrypto encryptText:@"my target text" withKey:key andSalt:salt andHMAC:hmac andRounds:192348];
    NSArray *components = [encrypted componentsSeparatedByString:@"|"];
    XCTAssert(components.count == 4);
}

- (void)testDecryptWorks {
    int rounds = 192348;
    NSString *testString = @"This is My! sample STRING 11222 ";
    NSString *key = @"d1de434664c6db7a2a8fdae4a6fbe83f876707b306b6c7dd2b15e518429ac08d";
    NSString *hmacKey = @"2684372578ce8a1b29fe6d7efd3bd4c8c8be396b238a77a8b4f785fb8e709d86";
    NSString *salt = @"some salt!";
    // Encrypt
    NSString *encrypted = [BCCrypto encryptText:testString withKey:key andSalt:salt andHMAC:hmacKey andRounds:rounds];
    NSArray *components = [encrypted componentsSeparatedByString:@"|"];
    // Props
    NSString *encryptedText = [components objectAtIndex:0];
    NSString *hmacOut = [components objectAtIndex:1];
    NSString *ivOut = [components objectAtIndex:2];
    NSString *saltOut = [components objectAtIndex:3];
    // Decrypt
    NSString *decrypted = [BCCrypto decryptText:encryptedText withKey:key andIV:ivOut andSalt:saltOut andHMACKey:hmacKey andHMAC:hmacOut];
    // Test
    XCTAssert([decrypted isEqualToString:testString]);
}


@end
