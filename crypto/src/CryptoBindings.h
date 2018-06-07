#include <stdint.h>
#include <stdlib.h>
#include <stdbool.h>

const char* pbkdf2_derive(const char* password, const char* salt, uint32_t iterations, uint32_t bits);
