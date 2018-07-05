extern crate base64;
extern crate buttercup_crypto;
extern crate hex;
extern crate uuid;

use buttercup_crypto::derivation::pbkdf2;
use buttercup_crypto::encryption::cbc;
use buttercup_crypto::random::{generate_iv, generate_string};
use std::ffi::{CStr, CString};
use std::os::raw::{c_char, c_uint};
use uuid::Uuid;

fn glued_result(string_list: Vec<String>) -> Vec<u8> {
    let joined = string_list.join("$");
    let joined_bytes = joined.as_bytes();
    joined_bytes.to_vec()
}

fn generated_glued_uuid_list(count: usize) -> String {
    let mut list = Vec::<String>::new();
    for _ in 0..count {
        list.push(format!("{}", Uuid::new_v4()));
    }
    list.join(",")
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
    let result_hex = hex::encode(result);
    CString::from_vec_unchecked(Vec::from(result_hex)).into_raw()
}

#[no_mangle]
pub unsafe extern "C" fn encrypt_cbc(
    base64_data: *const c_char, // UTF8 String
    key: *const c_char,         // Hex
    salt: *const c_char,        // UTF8 String
    iv_hex: *const c_char,      // Hex
    hmac_key: *const c_char,    // Hex
) -> *mut c_char {
    let data_str = base64::decode(CStr::from_ptr(base64_data).to_bytes()).unwrap();
    let key_str = hex::decode(CStr::from_ptr(key).to_bytes()).unwrap();
    let salt_str = CStr::from_ptr(salt).to_bytes();
    let iv_bytes = hex::decode(CStr::from_ptr(iv_hex).to_bytes()).unwrap();
    let hmac_str = hex::decode(CStr::from_ptr(hmac_key).to_bytes()).unwrap();

    let result = cbc::encrypt(
        data_str.as_slice(),
        key_str.as_slice(),
        salt_str,
        iv_bytes.as_slice(),
        hmac_str.as_slice(),
    );

    let (base64_result, hmac_code, iv, new_salt) = result.ok().unwrap();
    let glue = glued_result(vec![
        base64_result,
        hex::encode(hmac_code),
        hex::encode(iv),
        String::from_utf8_unchecked(new_salt),
    ]);

    CString::from_vec_unchecked(glue).into_raw()
}

#[no_mangle]
pub unsafe extern "C" fn decrypt_cbc(
    base64_data: *const c_char, // UTF8 String
    key: *const c_char,         // Hex
    iv: *const c_char,          // Hex
    salt: *const c_char,        // UTF8 String
    hmac_key: *const c_char,    // Hex
    hmac: *const c_char,        // Hex
) -> *mut c_char {
    let data_str = CStr::from_ptr(base64_data).to_bytes();
    let key_str = hex::decode(CStr::from_ptr(key).to_bytes()).unwrap();
    let iv_str = hex::decode(CStr::from_ptr(iv).to_bytes()).unwrap();
    let salt_str = CStr::from_ptr(salt).to_bytes();
    let hmac_key_str = hex::decode(CStr::from_ptr(hmac_key).to_bytes()).unwrap();
    let hmac_str = hex::decode(CStr::from_ptr(hmac).to_bytes()).unwrap();

    let result = cbc::decrypt(
        data_str,
        key_str.as_slice(),
        iv_str.as_slice(),
        salt_str,
        hmac_key_str.as_slice(),
        hmac_str.as_slice(),
    );

    let decrypted_result = result.ok().unwrap();
    let decrypted_base64 = base64::encode(decrypted_result.as_slice());

    CString::from_vec_unchecked(Vec::from(decrypted_base64)).into_raw()
}

#[no_mangle]
pub unsafe extern "C" fn generate_uuid_list(count: c_uint) -> *mut c_char {
    let string = generated_glued_uuid_list(count as usize);
    CString::from_vec_unchecked(Vec::from(string)).into_raw()
}

#[no_mangle]
pub unsafe extern "C" fn generate_salt(length: c_uint) -> *mut c_char {
    let salt = generate_string(length as usize);
    CString::from_vec_unchecked(Vec::from(salt)).into_raw()
}

#[no_mangle]
pub unsafe extern "C" fn generate_random_bytes() -> *mut c_char {
    let iv = hex::encode(generate_iv());
    CString::from_vec_unchecked(Vec::from(iv)).into_raw()
}

#[cfg(target_os = "android")]
#[allow(non_snake_case)]
pub mod android {
    extern crate jni;

    use self::jni::objects::{JClass, JString};
    use self::jni::sys::jstring;
    use self::jni::JNIEnv;
    use super::*;

    fn env_get_string(env: &JNIEnv, var: JString, name: &str) -> String {
        env.get_string(var)
            .expect(&format!("Couldn't get {} from JNI Environment.", name))
            .into()
    }

    fn env_get_hex_string(env: &JNIEnv, var: JString, name: &str) -> Vec<u8> {
        let string = env_get_string(env, var, name);
        let decoded =
            hex::decode(string).expect(&format!("Could not decode JNI input hex: {}", name));

        decoded
    }

    fn env_get_base64_string(env: &JNIEnv, var: JString, name: &str) -> Vec<u8> {
        let string = env_get_string(env, var, name);
        let decoded =
            base64::decode(&string).expect(&format!("Could not decode JNI input base64: {}", name));

        decoded
    }

    fn return_string_pointer(env: &JNIEnv, input: String) -> jstring {
        let output = env.new_string(input).expect("Couldn't create JNI string");
        output.into_inner()
    }

    #[no_mangle]
    pub extern "system" fn Java_com_buttercup_Crypto_deriveKeyFromPassword(
        env: JNIEnv,
        _: JClass,
        password: JString,
        salt: JString,
        iterations: c_uint,
        bits: c_uint,
    ) -> jstring {
        let password = env_get_string(&env, password, "Password");
        let salt = env_get_string(&env, salt, "Salt");
        let result = pbkdf2(&password, &salt, iterations as usize, bits as usize);
        return_string_pointer(&env, hex::encode(result))
    }

    #[no_mangle]
    pub extern "system" fn Java_com_buttercup_Crypto_encryptCBC(
        env: JNIEnv,
        _: JClass,
        encoded_text: JString, // Base64 Encoded text
        key_hex: JString,      // Hex
        salt: JString,         // UTF8 String
        iv_hex: JString,       // Hex
        hmac_key_hex: JString, // Hex
    ) -> jstring {
        // Convert pointers into data
        let data = env_get_base64_string(&env, encoded_text, "Encoded Data");
        let key = env_get_hex_string(&env, key_hex, "Key");
        let salt = env_get_string(&env, salt, "Salt");
        let iv = env_get_hex_string(&env, iv_hex, "IV");
        let hmac_key = env_get_hex_string(&env, hmac_key_hex, "HMAC Key");

        // Encrypt
        let result = cbc::encrypt(
            data.as_slice(),
            key.as_slice(),
            salt.as_bytes(),
            iv.as_slice(),
            hmac_key.as_slice(),
        );

        let (base64_result, hmac_code, iv, _) = result.ok().unwrap();
        let glue = glued_result(vec![
            base64_result,
            hex::encode(hmac_code),
            hex::encode(iv),
            salt,
        ]);
        return_string_pointer(&env, String::from_utf8(glue).ok().unwrap())
    }

    #[no_mangle]
    pub extern "system" fn Java_com_buttercup_Crypto_decryptCBC(
        env: JNIEnv,
        _: JClass,
        data: JString,         // UTF8 String
        key_hex: JString,      // Hex
        iv_hex: JString,       // Hex
        salt: JString,         // UTF8 String
        hmac_key_hex: JString, // Hex
        hmac_hex: JString,     // Hex
    ) -> jstring {
        // Convert pointers into data
        let data = env_get_string(&env, data, "Data");
        let key = env_get_hex_string(&env, key_hex, "Key");
        let iv = env_get_hex_string(&env, iv_hex, "IV");
        let salt = env_get_string(&env, salt, "Salt");
        let hmac_key = env_get_hex_string(&env, hmac_key_hex, "HMAC Key");
        let hmac = env_get_hex_string(&env, hmac_hex, "HMAC");

        // Decrypt
        let result = cbc::decrypt(
            data.as_bytes(),
            key.as_slice(),
            iv.as_slice(),
            salt.as_bytes(),
            hmac_key.as_slice(),
            hmac.as_slice(),
        );

        let decrypted_result = result.ok().unwrap();
        let decrypted_base64 = base64::encode(decrypted_result.as_slice());

        return_string_pointer(&env, decrypted_base64)
    }

    #[no_mangle]
    pub extern "system" fn Java_com_buttercup_Crypto_generateUUIDList(
        env: JNIEnv,
        _: JClass,
        count: c_uint,
    ) -> jstring {
        let string = generated_glued_uuid_list(count as usize);
        return_string_pointer(&env, string)
    }

    #[no_mangle]
    pub extern "system" fn Java_com_buttercup_Crypto_generateSalt(
        env: JNIEnv,
        _: JClass,
        length: c_uint,
    ) -> jstring {
        let salt = generate_string(length as usize);
        return_string_pointer(&env, salt)
    }

    #[no_mangle]
    pub extern "system" fn Java_com_buttercup_Crypto_generateRandomBytes(
        env: JNIEnv,
        _: JClass,
    ) -> jstring {
        let iv = generate_iv();
        return_string_pointer(&env, hex::encode(iv))
    }

}
