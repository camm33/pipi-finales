#!/usr/bin/env python3

"""
Script para verificar qué usuario está logueado y sus publicaciones
"""

from bd import obtener_conexion
import pymysql.cursors

def verificar_usuario_y_publicaciones():
    """Verifica el usuario autenticado y sus publicaciones"""
    
    conexion = obtener_conexion()
    try:
        with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
            
            print("=== VERIFICANDO TODAS LAS PUBLICACIONES ===")
            cursor.execute("""
                SELECT p.id_publicacion, p.id_usuario, p.estado, pr.nombre, pr.talla
                FROM publicacion p 
                JOIN prenda pr ON p.id_publicacion = pr.id_publicacion
                ORDER BY p.id_publicacion DESC
            """)
            publicaciones = cursor.fetchall()
            
            print(f"Total publicaciones: {len(publicaciones)}")
            for pub in publicaciones:
                print(f"  Pub {pub['id_publicacion']}: Usuario {pub['id_usuario']}, Estado: {pub['estado']}, Prenda: {pub['nombre']}")
            
            print("\n=== VERIFICANDO VISTA VISTA_OTROS_PERFILES ===")
            cursor.execute("SELECT COUNT(*) as total FROM vista_otros_perfiles")
            result = cursor.fetchone()
            print(f"Total en vista_otros_perfiles: {result['total']}")
            
            if result['total'] > 0:
                cursor.execute("SELECT * FROM vista_otros_perfiles LIMIT 5")
                perfiles = cursor.fetchall()
                for perfil in perfiles:
                    print(f"  Usuario {perfil['id_usuario']}: {perfil['username_usuario']}, Prenda: {perfil['nombre_prenda']}")
            
            print("\n=== VERIFICANDO USUARIOS RECIENTES ===")
            cursor.execute("""
                SELECT id_usuario, username, primer_nombre, email 
                FROM usuario 
                WHERE id_usuario >= 20
                ORDER BY id_usuario DESC
            """)
            usuarios = cursor.fetchall()
            for user in usuarios:
                print(f"  ID {user['id_usuario']}: {user['username']} ({user['email']}) - {user['primer_nombre']}")
                
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        conexion.close()

if __name__ == "__main__":
    verificar_usuario_y_publicaciones()