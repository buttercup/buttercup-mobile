#include <stdint.h>
#include <stdlib.h>
#include <stdbool.h>

const char* pbkdf2_derive(const char* password, const char* salt, uint32_t iterations, uint32_t bits);
const char* encrypt_cbc(const char* data, const char* key, const char* salt, const char* hmac_key);
const char* decrypt_cbc(const char* data, const char* key, const char* iv, const char* salt, const char* hmac_key, const char* hmac);
const char* generate_uuid_list(uint32_t count);
const char* generate_salt(uint32_t count);
