import hashlib
import random

def generate_salt():
    """Generates random salt with 16 characters (lower, upper leters and digits).
    
    Returns:
        String composed of 16 random characters.
    """

    ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    salt = ""

    for i in range(16):
        salt += random.choice(ALPHABET)

    print("Salt: " + salt)
    return salt

def hash_password(password, salt):
    """Using the sha256 crypto algorithm hash the combination of password and salt in 10 iterations.
    
    Parameters:
        password: Password.
        salt: Salt.
    
    Returns:
        Hashed password.
    """

    print("Password: " + password)
    hashed_password = password

    for i in range(10):
        salted_password = (salt + hashed_password).encode('utf-8')
        hashed_password = hashlib.sha256(salted_password).hexdigest()
        print("Iteration " + str(i) + ": " + hashed_password)

    return hashed_password