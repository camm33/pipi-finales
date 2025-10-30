import os
import pymysql
from flask import Blueprint, jsonify, current_app, request
from bd import obtener_conexion

detalle_prenda_bp = Blueprint('detalle_prenda_bp', __name__)


@detalle_prenda_bp.route('/api/detalle_prenda/<int:id_prenda>', methods=['GET'])
def api_detalle_prenda(id_prenda):
    """Devuelve el detalle de una prenda usando la vista/consulta indicada.
    Retorna JSON con clave 'prenda' que contiene un array con el objeto (para compatibilidad con el frontend).
    """
    try:
        conexion = obtener_conexion()
    except Exception as e:
        return jsonify({"status": "error", "message": f"Error al obtener conexión: {e}"}), 500
    try:
        with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(
                """
                SELECT 
                    p.id_prenda,
                    p.nombre,
                    u.username,
                    u.id_usuario,
                    pub.descripcion,
                    p.talla,
                    p.foto,
                    p.foto2,
                    p.foto3,
                    p.foto4,
                    p.valor,
                    pub.tipo_publicacion
                FROM prenda p
                INNER JOIN publicacion pub ON p.id_publicacion = pub.id_publicacion
                INNER JOIN usuario u ON pub.id_usuario = u.id_usuario
                WHERE p.id_prenda = %s
                """,
                (id_prenda,)
            )
            fila = cursor.fetchone()

        if not fila:
            return jsonify({"prenda": []}), 200

        # Añadir URLs públicas para fotos (opcional)
        base_url = request.host_url.rstrip('/')
        for key in ('foto', 'foto2', 'foto3', 'foto4'):
            if fila.get(key):
                fila[f"{key}_url"] = f"{base_url}/uploads/{fila.get(key)}"

        return jsonify({"prenda": [fila]}), 200

    except Exception as e:
        # Log básico en consola y devolver error amigable
        print(f"Error en api_detalle_prenda: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

    finally:
        try:
            if conexion:
                conexion.close()
        except Exception:
            pass

@detalle_prenda_bp.route('/api/publicaciones', methods=['GET'])
def api_publicaciones():
    """
    Devuelve las publicaciones desde la vista SQL 'catalogo'.
    Solo muestra las prendas disponibles.
    """
    try:
        conexion = obtener_conexion()
    except Exception as e:
        return jsonify({"ok": False, "error": f"Error al obtener conexión: {e}"}), 500
    try:
        with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
                SELECT 
                    id_publicacion,
                    tipo_publicacion,
                    id_prenda,
                    nombre_prenda,
                    talla,
                    foto,
                    valor,
                    id_usuario
                FROM catalogo
                ORDER BY id_publicacion DESC
            """)
            publicaciones = cursor.fetchall()

        # Si la vista/catalogo tiene columnas con nombres distintos, normalizamos
        def pick(d, alternatives):
            for a in alternatives:
                if a in d and d[a] is not None:
                    return d[a]
            return None

        # Determinar base_url dinámicamente desde la petición
        base_url = request.host_url.rstrip('/')

        publicaciones_normalizadas = []
        for row in publicaciones:
            # mapear campos comunes usando alternativas posibles
            id_publicacion = pick(row, ['id_publicacion', 'publicacion_id', 'id_publicacion'])
            tipo_publicacion = pick(row, ['tipo_publicacion', 'tipo', 'tipo_publicacion'])
            id_prenda = pick(row, ['id_prenda', 'prenda_id', 'id'])
            nombre_prenda = pick(row, ['nombre_prenda', 'nombre', 'nombre_prenda'])
            foto_field = pick(row, ['foto', 'imagen', 'image', 'foto_principal'])
            valor = pick(row, ['valor', 'price', 'precio'])
            id_usuario = pick(row, ['id_usuario', 'usuario_id', 'user_id'])
            talla = pick(row, ['talla', 'size'])

            item = {
                'id_publicacion': id_publicacion,
                'tipo_publicacion': tipo_publicacion,
                'id_prenda': id_prenda,
                'nombre_prenda': nombre_prenda,
                'foto': foto_field,
                'valor': valor,
                'id_usuario': id_usuario,
                'talla': talla,
            }

            if foto_field:
                item['foto_url'] = f"{base_url}/uploads/{foto_field}"

            publicaciones_normalizadas.append(item)

        return jsonify({"ok": True, "publicaciones": publicaciones_normalizadas}), 200

    except Exception as e:
        print(f"Error en api_publicaciones: {e}")
        return jsonify({"ok": False, "error": str(e)}), 500
    finally:
        try:
            if conexion:
                conexion.close()
        except Exception:
            pass