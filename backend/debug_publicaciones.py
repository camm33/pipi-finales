#!/usr/bin/env python3

"""
Script de depuración para verificar el estado de las publicaciones
"""

from bd import obtener_conexion
import pymysql.cursors

def verificar_publicaciones():
    """Verifica el estado de publicaciones, prendas y la vista catalogo"""
    
    conexion = obtener_conexion()
    try:
        with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
            
            print("=== VERIFICANDO TABLA PUBLICACION ===")
            cursor.execute("SELECT COUNT(*) as total FROM publicacion")
            result = cursor.fetchone()
            print(f"Total publicaciones: {result['total']}")
            
            if result['total'] > 0:
                cursor.execute("SELECT * FROM publicacion ORDER BY id_publicacion DESC LIMIT 5")
                publicaciones = cursor.fetchall()
                print("Últimas 5 publicaciones:")
                for pub in publicaciones:
                    print(f"  ID: {pub['id_publicacion']}, Usuario: {pub['id_usuario']}, Tipo: {pub['tipo_publicacion']}")
            
            print("\n=== VERIFICANDO TABLA PRENDA ===")
            cursor.execute("SELECT COUNT(*) as total FROM prenda")
            result = cursor.fetchone()
            print(f"Total prendas: {result['total']}")
            
            if result['total'] > 0:
                cursor.execute("SELECT id_prenda, nombre, talla, id_publicacion FROM prenda ORDER BY id_prenda DESC LIMIT 5")
                prendas = cursor.fetchall()
                print("Últimas 5 prendas:")
                for prenda in prendas:
                    print(f"  ID: {prenda['id_prenda']}, Nombre: {prenda['nombre']}, Talla: {prenda['talla']}, Publicación: {prenda['id_publicacion']}")
            
            print("\n=== VERIFICANDO VISTA CATALOGO ===")
            cursor.execute("SELECT COUNT(*) as total FROM catalogo")
            result = cursor.fetchone()
            print(f"Total items en catálogo: {result['total']}")
            
            if result['total'] > 0:
                cursor.execute("SELECT id_publicacion, nombre_prenda, talla, tipo_publicacion, id_usuario FROM catalogo ORDER BY id_publicacion DESC LIMIT 5")
                catalogo = cursor.fetchall()
                print("Últimos 5 items del catálogo:")
                for item in catalogo:
                    print(f"  Pub: {item['id_publicacion']}, Prenda: {item['nombre_prenda']}, Talla: {item['talla']}, Tipo: {item['tipo_publicacion']}, Usuario: {item['id_usuario']}")
            
            print("\n=== VERIFICANDO USUARIOS ===")
            cursor.execute("SELECT id_usuario, username, primer_nombre FROM usuario ORDER BY id_usuario DESC LIMIT 5")
            usuarios = cursor.fetchall()
            print("Últimos 5 usuarios:")
            for user in usuarios:
                print(f"  ID: {user['id_usuario']}, Username: {user['username']}, Nombre: {user['primer_nombre']}")
                
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        conexion.close()

if __name__ == "__main__":
    verificar_publicaciones()