#!/usr/bin/env python3

"""
Script para actualizar la vista catalogo usando la configuración de Flask
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from app import app, mysql

def actualizar_vista_catalogo():
    """Actualiza la vista catalogo para incluir todos los campos necesarios"""
    
    with app.app_context():
        try:
            cursor = mysql.connection.cursor()
            
            # Actualizar la vista catalogo
            sql_view = """
            CREATE OR REPLACE VIEW catalogo AS
            SELECT 
                p.id_publicacion,
                p.descripcion,
                p.estado,
                p.tipo_publicacion,
                p.fecha_publicacion,
                pr.id_prenda,
                pr.nombre AS nombre_prenda,
                pr.descripcion_prenda,
                pr.talla,
                pr.foto,
                pr.foto2,
                pr.foto3,
                pr.foto4,
                pr.valor,
                p.id_usuario
            FROM publicacion p
            JOIN prenda pr ON p.id_publicacion = pr.id_publicacion
            WHERE p.estado = 'Disponible'
            """
            
            cursor.execute(sql_view)
            mysql.connection.commit()
            print("✅ Vista catalogo actualizada exitosamente")
            
            # Verificar el contenido
            cursor.execute("SELECT * FROM catalogo")
            resultados = cursor.fetchall()
            print(f"📊 Total items en catálogo: {len(resultados)}")
            
            if resultados:
                print("Primeros items:")
                for i, item in enumerate(resultados[:3]):
                    print(f"  {i+1}: {item}")
                
        except Exception as e:
            print(f"❌ Error: {e}")
        finally:
            cursor.close()

if __name__ == "__main__":
    actualizar_vista_catalogo()