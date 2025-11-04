import bd

def cambiar_foto_prenda():
    conn = bd.obtener_conexion()
    try:
        with conn.cursor() as cursor:
            # Cambiar la foto de la "Sudadera Calida Gris" por otra imagen disponible
            cursor.execute("UPDATE prenda SET foto = 'chaqueta1.jpg' WHERE nombre = 'Sudadera Calida Gris'")
            conn.commit()
            
            print("✅ Foto de la prenda actualizada exitosamente")
            
            # Verificar el cambio
            cursor.execute("SELECT id_prenda, nombre, foto FROM prenda WHERE nombre = 'Sudadera Calida Gris'")
            result = cursor.fetchone()
            if result:
                print(f"✅ Nueva prenda: ID: {result[0]}, Nombre: '{result[1]}', Foto: {result[2]}")
            else:
                print("❌ No se encontró la prenda")
                
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    cambiar_foto_prenda()
