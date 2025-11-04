import bd

def eliminar_publicacion_sueter():
    conn = bd.obtener_conexion()
    try:
        with conn.cursor() as cursor:
            # Primero, encontrar la prenda "Sudadera Calida Gris"
            cursor.execute("SELECT id_prenda, id_publicacion FROM prenda WHERE nombre = 'Sudadera Calida Gris'")
            prenda = cursor.fetchone()
            
            if prenda:
                id_prenda = prenda[0]
                id_publicacion = prenda[1]
                
                print(f"📋 Encontrada prenda: ID {id_prenda}, Publicación ID {id_publicacion}")
                
                # Eliminar la prenda primero
                cursor.execute("DELETE FROM prenda WHERE id_prenda = %s", (id_prenda,))
                
                # Eliminar la publicación
                if id_publicacion:
                    cursor.execute("DELETE FROM publicacion WHERE id_publicacion = %s", (id_publicacion,))
                
                conn.commit()
                
                print("✅ Publicación 'Sudadera Calida Gris' eliminada exitosamente")
                
                # Verificar que se eliminó
                cursor.execute("SELECT COUNT(*) FROM prenda WHERE nombre = 'Sudadera Calida Gris'")
                count = cursor.fetchone()[0]
                
                if count == 0:
                    print("✅ Confirmado: La publicación ya no existe en la base de datos")
                else:
                    print("❌ Error: La publicación aún existe")
                    
            else:
                print("❌ No se encontró la prenda 'Sudadera Calida Gris'")
                
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    eliminar_publicacion_sueter()