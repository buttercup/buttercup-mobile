extern crate buttercup_crypto;
extern crate hex;

use buttercup_crypto::derivation::pbkdf2;
use buttercup_crypto::encryption::cbc;
use std::ffi::{CStr, CString};
use std::os::raw::{c_char, c_uint};

fn glued_result(string_list: Vec<String>) -> Vec<u8> {
    let joined = string_list.join("$");
    let joined_bytes = joined.as_bytes();
    joined_bytes.to_vec()
}

#[no_mangle]
pub unsafe extern "C" fn pbkdf2_derive(
    password: *const c_char,
    salt: *const c_char,
    iterations: c_uint,
    bits: c_uint,
) -> *mut c_char {
    let password_str = CStr::from_ptr(password);
    let salt_str = CStr::from_ptr(salt);
    let result = pbkdf2(
        password_str.to_str().unwrap(),
        salt_str.to_str().unwrap(),
        iterations as usize,
        bits as usize,
    );
    CString::from_vec_unchecked(result).into_raw()
}

#[no_mangle]
pub unsafe extern "C" fn encrypt_cbc(
    data: *const c_char,     // UTF8 String
    key: *const c_char,      // Hex
    salt: *const c_char,     // Hex
    hmac_key: *const c_char, // Hex
) -> *mut c_char {
    let data_str = CStr::from_ptr(data);
    let key_str = hex::decode(CStr::from_ptr(key).to_bytes()).unwrap();
    let hmac_str = hex::decode(CStr::from_ptr(hmac_key).to_bytes()).unwrap();
    let salt_str = hex::decode(CStr::from_ptr(salt).to_bytes()).unwrap();

    let result = cbc::encrypt(
        data_str.to_bytes(),
        key_str.as_slice(),
        salt_str.as_slice(),
        hmac_str.as_slice(),
    );

    let (base64_result, hmac_code, iv, new_salt) = result.ok().unwrap();
    let glue = glued_result(vec![
        base64_result,
        hex::encode(hmac_code),
        hex::encode(iv),
        hex::encode(new_salt),
    ]);

    CString::from_vec_unchecked(glue).into_raw()
}
