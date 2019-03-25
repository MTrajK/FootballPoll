import hashlib
import random

# 16 chars salt
def generate_salt():
    ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    salt = ""

    for i in range(16):
        salt += random.choice(ALPHABET)

    print("Salt: " + salt)
    return salt

# using sha256 make 10 iterations
def hash_password(password, salt):
    print("Password: " + password)
    hashed_password = password

    for i in range(10):
        salted_password = (salt + hashed_password).encode('utf-8')
        hashed_password = hashlib.sha256(salted_password).hexdigest()
        print("Iteration " + str(i) + ": " + hashed_password)

    return hashed_password

password = "put password here"
salt = generate_salt()

hashed_password = hash_password(password, salt)
print("Final: " + hashed_password)