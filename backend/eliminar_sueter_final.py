import bd

def verificar_y_eliminar_sueter():
    conn = bd.obtener_conexion()
    try:
        with conn.cursor() as cursor:
            # Verificar todas las prendas que contienen "sueter" o "gris"
            cursor.execute("SELECT id_prenda, nombre, descripcion_prenda, foto, id_publicacion FROM prenda WHERE nombre LIKE '%Sueter%' OR nombre LIKE '%sueter%' OR nombre LIKE '%Gris%' OR nombre LIKE '%gris%' OR nombre LIKE '%Calido%' OR nombre LIKE '%calido%'")
            prendas = cursor.fetchall()
            
            print("📋 Prendas encontradas:")
            for prenda in prendas:
                print(f"  - ID: {prenda[0]}, Nombre: '{prenda[1]}', Descripción: '{prenda[2]}', Foto: {prenda[3]}, Publicación: {prenda[4]}")
            
            if prendas:
                # Eliminar todas las prendas relacionadas con sueter
                for prenda in prendas:
                    id_prenda = prenda[0]
                    id_publicacion = prenda[4]
                    
                    print(f"🗑️ Eliminando prenda ID {id_prenda}...")
                    
                    # Eliminar la prenda
                    cursor.execute("DELETE FROM prenda WHERE id_prenda = %s", (id_prenda,))
                    
                    # Eliminar la publicación si existe
                    if id_publicacion:
                        cursor.execute("DELETE FROM publicacion WHERE id_publicacion = %s", (id_publicacion,))
                        print(f"🗑️ Eliminando publicación ID {id_publicacion}...")
                
                conn.commit()
                print("✅ Todas las prendas relacionadas con 'sueter' eliminadas")
                
                # Verificar que se eliminaron
                cursor.execute("SELECT COUNT(*) FROM prenda WHERE nombre LIKE '%sueter%' OR nombre LIKE '%Sueter%' OR nombre LIKE '%gris%' OR nombre LIKE '%Gris%'")
                count = cursor.fetchone()[0]
                
                if count == 0:
                    print("✅ Confirmado: No quedan prendas con 'sueter' o 'gris'")
                else:
                    print(f"⚠️ Aún quedan {count} prendas relacionadas")
            else:
                print("ℹ️ No se encontraron prendas con 'sueter' o 'gris'")
                
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    verificar_y_eliminar_sueter()