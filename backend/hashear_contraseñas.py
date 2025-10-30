import bcrypt
import MySQLdb

# Configuración de base de datos
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'Double_P'
}

def hashear_contraseñas_existentes():
    try:
        # Conectar a la base de datos
        connection = MySQLdb.connect(**db_config)
        cursor = connection.cursor()
        
        # Obtener todos los usuarios con contraseñas en texto plano
        cursor.execute("SELECT id_usuario, contrasena FROM usuario WHERE contrasena IS NOT NULL")
        usuarios = cursor.fetchall()
        
        print(f"Encontrados {len(usuarios)} usuarios para actualizar...")
        
        for id_usuario, contrasena_plana in usuarios:
            # Verificar si ya está hasheada (bcrypt hashes empiezan con $2b$)
            if contrasena_plana.startswith('$2b$'):
                print(f"Usuario {id_usuario}: contraseña ya está hasheada, saltando...")
                continue
            
            # Hashear la contraseña
            hashed = bcrypt.hashpw(contrasena_plana.encode('utf-8'), bcrypt.gensalt())
            hashed_str = hashed.decode('utf-8')
            
            # Actualizar en la base de datos
            cursor.execute(
                "UPDATE usuario SET contrasena = %s WHERE id_usuario = %s",
                (hashed_str, id_usuario)
            )
            
            print(f"Usuario {id_usuario}: contraseña actualizada de '{contrasena_plana}' a hash bcrypt")
        
        # Confirmar los cambios
        connection.commit()
        print("✅ Todas las contraseñas han sido actualizadas correctamente!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        if 'connection' in locals():
            connection.close()

if __name__ == "__main__":
    print("🔐 Actualizando contraseñas a bcrypt...")
    hashear_contraseñas_existentes()