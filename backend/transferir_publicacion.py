#!/usr/bin/env python3

"""
Script para transferir la publicación al usuario logueado actual
"""

from bd import obtener_conexion
import pymysql.cursors

def transferir_publicacion():
    """Transfiere la publicación del usuario 11 al usuario 21"""
    
    conexion = obtener_conexion()
    try:
        with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
            
            print("=== ANTES DE LA TRANSFERENCIA ===")
            cursor.execute("SELECT id_publicacion, id_usuario FROM publicacion WHERE id_publicacion = 1")
            pub_antes = cursor.fetchone()
            print(f"Publicación 1 pertenece al usuario: {pub_antes['id_usuario']}")
            
            # Transferir la publicación al usuario 21 (Fernanda Betancourt / lisa2000buitrago@gmail.com)
            cursor.execute("""
                UPDATE publicacion 
                SET id_usuario = 21 
                WHERE id_publicacion = 1
            """)
            
            print("=== DESPUÉS DE LA TRANSFERENCIA ===")
            cursor.execute("SELECT id_publicacion, id_usuario FROM publicacion WHERE id_publicacion = 1")
            pub_despues = cursor.fetchone()
            print(f"Publicación 1 ahora pertenece al usuario: {pub_despues['id_usuario']}")
            
            # Verificar las vistas actualizadas
            print("\n=== VERIFICANDO VISTA CATALOGO ===")
            cursor.execute("SELECT id_publicacion, id_usuario, nombre_prenda FROM catalogo")
            catalogo = cursor.fetchall()
            for item in catalogo:
                print(f"  Pub {item['id_publicacion']}: Usuario {item['id_usuario']}, Prenda: {item['nombre_prenda']}")
            
            print("\n=== VERIFICANDO VISTA_OTROS_PERFILES ===")
            cursor.execute("SELECT id_usuario, username_usuario, nombre_prenda FROM vista_otros_perfiles WHERE id_usuario = 21")
            perfiles = cursor.fetchall()
            print(f"Publicaciones del usuario 21: {len(perfiles)}")
            for perfil in perfiles:
                print(f"  Usuario {perfil['id_usuario']} ({perfil['username_usuario']}): {perfil['nombre_prenda']}")
        
        conexion.commit()
        print("\n✅ Transferencia completada exitosamente")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        conexion.rollback()
    finally:
        conexion.close()

if __name__ == "__main__":
    transferir_publicacion()