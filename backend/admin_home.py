from flask import Blueprint, jsonify, session, request
from bd import obtener_conexion
from functools import wraps


def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        # Primera opción: permitir autenticación desde sesión del servidor (cookie)
        user_id = session.get("id_usuario")
        if user_id:
            # Consultar rol del usuario en la base de datos
            conexion = obtener_conexion()
            try:
                with conexion.cursor() as cursor:
                    cursor.execute("SELECT id_rol FROM usuario WHERE id_usuario=%s", (user_id,))
                    row = cursor.fetchone()
                if not row:
                    return jsonify({"ok": False, "error": "Usuario no encontrado"}), 404
                id_rol = row[0] if isinstance(row, (list, tuple)) else row.get("id_rol")
                if id_rol == 1:
                    return f(*args, **kwargs)
                return jsonify({"ok": False, "error": "Acceso denegado"}), 403
            finally:
                conexion.close()

        # Segunda opción: aceptar rol/usuario enviado por cabeceras (útil para SPA que guarda rol en localStorage)
        # Nota: esto es menos seguro que la sesión; usar solo en entornos controlados o mejorar con tokens.
        header_role = request.headers.get("X-Id-Rol") or request.headers.get("X-IdRol")
        if header_role:
            try:
                if str(header_role) == "1":
                    return f(*args, **kwargs)
                return jsonify({"ok": False, "error": "Acceso denegado"}), 403
            except Exception:
                return jsonify({"ok": False, "error": "Cabecera de rol inválida"}), 400

        # Si ninguna autenticación válida, rechazar
        return jsonify({"ok": False, "error": "No autenticado"}), 401

        return f(*args, **kwargs)

    return wrapper

admin_home_bp = Blueprint("admin_home", __name__)

def query_single_value(sql):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute(sql)
        result = cursor.fetchone()
    conexion.close()
    return result[0] if result else 0


@admin_home_bp.route('/api/admin/total_usuarios')
@admin_required
def total_usuarios():
    total = query_single_value("SELECT total_usuarios FROM vista_total_usuarios")
    return jsonify({'total_usuarios': total})


@admin_home_bp.route('/api/admin/publicaciones_activas')
@admin_required
def publicaciones_activas():
    total = query_single_value("SELECT publicaciones_activas FROM vista_publicaciones_activas")
    return jsonify({'publicaciones_activas': total})


@admin_home_bp.route('/api/admin/numero_usuarios')
@admin_required
def numero_usuarios():
    total = query_single_value("SELECT numero_usuarios FROM vista_numero_usuarios")
    return jsonify({'numero_usuarios': total})


@admin_home_bp.route('/api/admin/numero_administradores')
@admin_required
def numero_administradores():
    total = query_single_value("SELECT numero_administradores FROM vista_numero_administradores")
    return jsonify({'numero_administradores': total})


@admin_home_bp.route("/api/admin/publicaciones_tipo")
@admin_required
def publicaciones_tipo():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT tipo_publicacion, COUNT(*) AS total
                FROM publicacion
                WHERE estado = 'Disponible'
                GROUP BY tipo_publicacion;
            """)
            resultados = cursor.fetchall()

        data = [{"tipo": row[0], "total": row[1]} for row in resultados]
        return jsonify({"ok": True, "data": data})

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})
    finally:
        conexion.close()
