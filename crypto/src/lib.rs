extern crate buttercup_crypto;

use buttercup_crypto::pbkdf2;
use std::ffi::{CStr, CString};
use std::os::raw::{c_char, c_uint};

#[no_mangle]
pub extern "C" fn pbkdf2_derive(
    password: *const c_char,
    salt: *const c_char,
    iterations: c_uint,
    bits: c_uint,
) -> *mut c_char {
    unsafe {
        let password_str = CStr::from_ptr(password);
        let salt_str = CStr::from_ptr(salt);
        let result = pbkdf2(
            password_str.to_str().unwrap(),
            salt_str.to_str().unwrap(),
            iterations,
            bits as usize,
        );
        CString::from_vec_unchecked(result).into_raw()
    }
}
