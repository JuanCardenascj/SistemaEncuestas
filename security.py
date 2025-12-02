import bcrypt

def get_password_hash(password: str) -> str:
    """
    Hashea una contraseña usando bcrypt
    """
    try:
        # Generar salt y hash la contraseña
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed_password.decode('utf-8')
    except Exception as e:
        raise Exception(f"Error al hashear contraseña: {str(e)}")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica si una contraseña coincide con el hash
    """
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'), 
            hashed_password.encode('utf-8')
        )
    except Exception as e:
        print(f"Error al verificar contraseña: {str(e)}")
        return False