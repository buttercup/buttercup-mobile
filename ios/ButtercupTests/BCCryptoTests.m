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
    NSString *encrypted = [BCCrypto encryptText:@"my target text" withKey:key andSalt:salt andHMAC:hmac];
    BOOL isError = [encrypted rangeOfString:@"Error"].location != NSNotFound;
    XCTAssert(!isError);
}

- (void)testEncryptContainsParts {
    NSString *key = @"d1de434664c6db7a2a8fdae4a6fbe83f876707b306b6c7dd2b15e518429ac08d";
    NSString *hmac = @"2684372578ce8a1b29fe6d7efd3bd4c8c8be396b238a77a8b4f785fb8e709d86";
    NSString *salt = @"some salt!";
    NSString *encrypted = [BCCrypto encryptText:@"my target text" withKey:key andSalt:salt andHMAC:hmac];
    NSArray *components = [encrypted componentsSeparatedByString:@"|"];
    XCTAssert(components.count == 4);
}

- (void)testDecryptWorks {
    NSString *testString = @"This is My! sample STRING 11222 ";
    NSString *key = @"d1de434664c6db7a2a8fdae4a6fbe83f876707b306b6c7dd2b15e518429ac08d";
    NSString *hmacKey = @"2684372578ce8a1b29fe6d7efd3bd4c8c8be396b238a77a8b4f785fb8e709d86";
    NSString *salt = @"some salt!";
    // Encrypt
    NSString *encrypted = [BCCrypto encryptText:testString withKey:key andSalt:salt andHMAC:hmacKey];
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

- (void)testGenerateIVHexGeneratesCorrectLength {
    NSString *iv = [BCCrypto generateIVHex];
    XCTAssert(iv.length == 32);
}

- (void)testGenerateSaltGeneratesCorrectLength {
    NSString *salt12 = [BCCrypto generateSaltWithLength:12];
    NSString *salt29 = [BCCrypto generateSaltWithLength:29];
    XCTAssert([salt12 length] == 12);
    XCTAssert([salt29 length] == 29);
}

- (void)testGenerateUUID {
    NSString *uuid = [BCCrypto generateUUID];
    NSString *uuidRegex = @"^[a-f0-9]{8}\\-[a-f0-9]{4}\\-[a-f0-9]{4}\\-[a-f0-9]{4}\\-[a-f0-9]{12}$";
    NSPredicate *test = [NSPredicate predicateWithFormat:@"SELF MATCHES %@", uuidRegex];
    BOOL matches = [test evaluateWithObject:uuid];
    XCTAssert(matches);
}

@end
