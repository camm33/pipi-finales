from flask import Blueprint, jsonify
from bd import obtener_conexion

usuarios_bp = Blueprint("usuarios", __name__, url_prefix="/api")

@usuarios_bp.route("/usuarios_disponibles", methods=["GET"])
def obtener_usuarios_disponibles():
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT id_usuario, username, email, foto, primer_nombre, primer_apellido
                FROM usuario 
                WHERE id_rol = 2
                ORDER BY username
            """)
            columns = [col[0] for col in cursor.description]
            usuarios = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        conexion.close()
        
        return jsonify({
            "success": True,
            "usuarios": usuarios
        })
        
    except Exception as e:
        print(f"Error al obtener usuarios: {e}")
        return jsonify({
            "success": False,
            "error": "Error interno del servidor"
        }), 500