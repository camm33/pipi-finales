#!/usr/bin/env python3
# Script temporal para crear la tabla valoracion_usuario

from bd import obtener_conexion

def crear_tabla_valoraciones():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Crear tabla valoracion_usuario
            sql_tabla = """
            CREATE TABLE IF NOT EXISTS valoracion_usuario (
                id_valoracion INT AUTO_INCREMENT PRIMARY KEY,
                id_usuario_valorador INT NOT NULL,
                id_usuario_valorado INT NOT NULL,
                puntuacion INT NOT NULL CHECK (puntuacion >= 1 AND puntuacion <= 5),
                fecha_valoracion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_usuario_valorador) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
                FOREIGN KEY (id_usuario_valorado) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
                UNIQUE KEY unique_valoracion (id_usuario_valorador, id_usuario_valorado)
            )
            """
            
            cursor.execute(sql_tabla)
            print("✅ Tabla valoracion_usuario creada exitosamente")
            
            # Crear vista para promedio de valoraciones
            sql_vista = """
            CREATE OR REPLACE VIEW promedio_valoraciones AS
            SELECT 
                u.id_usuario,
                u.primer_nombre,
                u.primer_apellido,
                u.username,
                COALESCE(AVG(v.puntuacion), 0) as promedio_valoracion,
                COUNT(v.id_valoracion) as total_valoraciones
            FROM usuario u
            LEFT JOIN valoracion_usuario v ON u.id_usuario = v.id_usuario_valorado
            GROUP BY u.id_usuario, u.primer_nombre, u.primer_apellido, u.username
            """
            
            cursor.execute(sql_vista)
            print("✅ Vista promedio_valoraciones creada exitosamente")
            
        conexion.commit()
        print("🎉 Base de datos actualizada correctamente")
        
    except Exception as e:
        print(f"❌ Error al crear las tablas: {e}")
        conexion.rollback()
    finally:
        conexion.close()

if __name__ == "__main__":
    crear_tabla_valoraciones()