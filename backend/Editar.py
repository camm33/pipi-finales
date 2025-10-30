from flask import Blueprint, request, session, jsonify, current_app
from bd import obtener_conexion
from pymysql.cursors import DictCursor
from werkzeug.utils import secure_filename
import os
import bcrypt

editar_perfil_bp = Blueprint("editar_perfil", __name__)

@editar_perfil_bp.route("/api/perfil", methods=["GET", "POST"])
def perfil():
    id_usuario = session.get("id_usuario")
    if not id_usuario:
        return jsonify({"error": "No autenticado"}), 401

    conexion = obtener_conexion()
    cursor = conexion.cursor(DictCursor)

    if request.method == "POST":
        cursor.execute("SELECT primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, email, fecha_nacimiento, talla, foto, contrasena FROM usuario WHERE id_usuario = %s", (id_usuario,))
        usuario_actual = cursor.fetchone()

        if not usuario_actual:
            cursor.close()
            conexion.close()
            return jsonify({"error": "Usuario no encontrado"}), 404

        # Obtener los valores del formulario o mantener los actuales
        primer_nombre = request.form.get("primer_nombre") or usuario_actual["primer_nombre"]
        segundo_nombre = request.form.get("segundo_nombre") or usuario_actual["segundo_nombre"]
        primer_apellido = request.form.get("primer_apellido") or usuario_actual["primer_apellido"]
        segundo_apellido = request.form.get("segundo_apellido") or usuario_actual["segundo_apellido"]
        email = request.form.get("email") or usuario_actual["email"]
        fecha_nacimiento = request.form.get("fecha_nacimiento") or usuario_actual["fecha_nacimiento"]
        talla = request.form.get("talla") or usuario_actual["talla"]
        contrasena_nueva = request.form.get("contrasena")
        foto_file = request.files.get("foto")

        # Procesar foto
        if foto_file and foto_file.filename != "":
            filename = secure_filename(foto_file.filename)
            ruta_foto = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
            foto_file.save(ruta_foto)
            ruta_foto_db = filename
        else:
            ruta_foto_db = usuario_actual["foto"]

        # Hashear la contraseña nueva con bcrypt si se envió
        if contrasena_nueva:
            contrasena_hashed = bcrypt.hashpw(contrasena_nueva.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        else:
            contrasena_hashed = usuario_actual["contrasena"]

        # Ejecutar UPDATE con todos los campos
        cursor.execute("""
            UPDATE usuario
            SET primer_nombre = %s, segundo_nombre = %s, primer_apellido = %s, segundo_apellido = %s, 
                email = %s, fecha_nacimiento = %s, talla = %s, foto = %s, contrasena = %s
            WHERE id_usuario = %s
        """, (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, 
              email, fecha_nacimiento, talla, ruta_foto_db, contrasena_hashed, id_usuario))

        conexion.commit()
        cursor.close()
        conexion.close()
        return jsonify({"mensaje": "Perfil actualizado con éxito"}), 200

    # GET - Vista perfil
    cursor.execute("""
        SELECT * FROM vista_perfil_completo_usuario
        WHERE id_usuario = %s
        ORDER BY fecha_publicacion DESC
    """, (id_usuario,))
    filas = cursor.fetchall()
    cursor.close()
    conexion.close()

    if not filas:
        return jsonify({"error": "Usuario no encontrado"}), 404

    usuario = {
        "id_usuario": id_usuario,
        "nombre": filas[0]["nombre"],
        "user_name": filas[0]["user_name"],
        "correo": filas[0]["email"],
        "talla": filas[0]["talla"],
        "fecha_nacimiento": filas[0]["fecha_nacimiento"].isoformat() if filas[0]["fecha_nacimiento"] else None,
        "foto": "/" + filas[0]["foto"] if filas[0]["foto"] else None,
        "estrellas": filas[0]["puntaje"] or 0,
        "publicaciones": []
    }

    for fila in filas:
        if fila["id_publicacion"]:
            usuario["publicaciones"].append({
                "descripcion": fila["descripcion_publicacion"],
                "tipo": fila["tipo_publicacion"],
                "fecha": fila["fecha_publicacion"].isoformat() if fila["fecha_publicacion"] else None
            })

    return jsonify(usuario)
