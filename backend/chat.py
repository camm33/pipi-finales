# chat.py
from flask import Blueprint, request, jsonify
from funciones_chat import (
    procesar_form_chat, 
    lista_mensajes_chat, 
    marcar_mensajes_como_leidos, 
    contar_mensajes_no_leidos,
    obtener_conversaciones_con_no_leidos
)
from mongodb import connectionBD

chat_bp = Blueprint("chat", __name__, url_prefix="/chat")

# Test de conectividad
@chat_bp.route("/test", methods=["GET"])
def test_chat():
    try:
        collection = connectionBD()
        if collection is not None:
            return jsonify({
                "status": "success", 
                "message": "Conexión a MongoDB exitosa",
                "database": collection.database.name,
                "collection": collection.name
            })
        else:
            return jsonify({"status": "error", "message": "No se pudo conectar a MongoDB"}), 500
    except Exception as e:
        return jsonify({"status": "error", "message": f"Error: {str(e)}"}), 500

# Obtener mensajes entre dos usuarios
@chat_bp.route("/mensajes", methods=["GET"])
def obtener_mensajes():
    try:
        emisor_id = request.args.get("id_remitente")  # Mantener compatibilidad con frontend
        receptor_id = request.args.get("id_destinatario")  # Mantener compatibilidad con frontend
        
        if not emisor_id or not receptor_id:
            return jsonify({"error": "Faltan parámetros id_remitente o id_destinatario"}), 400
            
        emisor_id = int(emisor_id)
        receptor_id = int(receptor_id)
        
        mensajes = lista_mensajes_chat(emisor_id, receptor_id)
        return jsonify(mensajes)
    except ValueError:
        return jsonify({"error": "Los IDs deben ser números enteros"}), 400
    except Exception as e:
        print(f"Error al obtener mensajes: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

# Enviar mensaje
@chat_bp.route("/mensajes", methods=["POST"])
def enviar_mensaje():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No se enviaron datos JSON"}), 400
            
        emisor_id = data.get("id_remitente")  # Mantener compatibilidad con frontend
        receptor_id = data.get("id_destinatario")  # Mantener compatibilidad con frontend
        contenido = data.get("mensaje")  # Mantener compatibilidad con frontend

        if not emisor_id or not receptor_id or not contenido:
            return jsonify({"error": "Faltan datos: id_remitente, id_destinatario o mensaje"}), 400

        # Validar que sean números
        emisor_id = int(emisor_id)
        receptor_id = int(receptor_id)
        
        # Validar que el mensaje no esté vacío
        if not contenido.strip():
            return jsonify({"error": "El mensaje no puede estar vacío"}), 400

        exito = procesar_form_chat(emisor_id, receptor_id, contenido.strip())
        if exito:
            mensajes_actualizados = lista_mensajes_chat(emisor_id, receptor_id)
            return jsonify({
                "success": True,
                "message": "Mensaje enviado correctamente",
                "mensajes": mensajes_actualizados
            })
        else:
            return jsonify({"success": False, "error": "No se pudo guardar el mensaje"}), 500
            
    except ValueError:
        return jsonify({"error": "Los IDs deben ser números enteros"}), 400
    except Exception as e:
        print(f"Error al enviar mensaje: {e}")
        return jsonify({"success": False, "error": "Error interno del servidor"}), 500

# Obtener lista de conversaciones de un usuario
@chat_bp.route("/conversaciones/<int:id_usuario>", methods=["GET"])
def obtener_conversaciones(id_usuario):
    try:
        collection = connectionBD()
        if collection is None:
            return jsonify({"error": "No se pudo conectar a MongoDB"}), 500
            
        # Buscar todas las conversaciones donde el usuario participa (nueva estructura)
        pipeline = [
            {
                "$match": {
                    "$or": [
                        {"emisor_id": id_usuario},
                        {"receptor_id": id_usuario}
                    ]
                }
            },
            {
                "$group": {
                    "_id": {
                        "$cond": [
                            {"$eq": ["$emisor_id", id_usuario]},
                            "$receptor_id",
                            "$emisor_id"
                        ]
                    },
                    "ultimo_mensaje": {"$last": "$contenido"},
                    "fecha_ultimo": {"$last": "$fecha_envio"}
                }
            },
            {"$sort": {"fecha_ultimo": -1}}
        ]
        
        conversaciones = list(collection.aggregate(pipeline))
        
        # Obtener información completa de usuarios desde MySQL
        from bd import obtener_conexion
        conexion = obtener_conexion()
        
        resultado = []
        for conv in conversaciones:
            id_otro_usuario = conv["_id"]
            
            with conexion.cursor() as cursor:
                cursor.execute("""
                    SELECT username, email, foto, primer_nombre, primer_apellido
                    FROM usuario 
                    WHERE id_usuario = %s
                """, (id_otro_usuario,))
                
                columns = [col[0] for col in cursor.description]
                usuario_data = cursor.fetchone()
                
                if usuario_data:
                    usuario_info = dict(zip(columns, usuario_data))
                    resultado.append({
                        "id_usuario": id_otro_usuario,
                        "username": usuario_info["username"],
                        "email": usuario_info["email"],
                        "foto_usuario": usuario_info["foto"],
                        "nombre_completo": f"{usuario_info['primer_nombre'] or ''} {usuario_info['primer_apellido'] or ''}".strip(),
                        "ultimo_mensaje": conv["ultimo_mensaje"],
                        "fecha_ultimo": conv["fecha_ultimo"].strftime("%Y-%m-%d %H:%M:%S")
                    })
        
        conexion.close()
        return jsonify(resultado)
        
    except Exception as e:
        print(f"Error al obtener conversaciones: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

# Marcar mensajes como leídos
@chat_bp.route("/marcar_leidos", methods=["POST"])
def marcar_leidos():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No se enviaron datos JSON"}), 400
            
        receptor_id = data.get("id_usuario")  # El que recibe los mensajes
        emisor_id = data.get("id_otro_usuario")  # El que envió los mensajes
        
        if not receptor_id or not emisor_id:
            return jsonify({"error": "Faltan parámetros id_usuario o id_otro_usuario"}), 400
            
        exito = marcar_mensajes_como_leidos(int(receptor_id), int(emisor_id))
        
        if exito:
            return jsonify({"success": True, "message": "Mensajes marcados como leídos"})
        else:
            return jsonify({"success": False, "error": "No se pudieron marcar los mensajes"}), 500
            
    except Exception as e:
        print(f"Error al marcar mensajes como leídos: {e}")
        return jsonify({"success": False, "error": "Error interno del servidor"}), 500

# Contar mensajes no leídos
@chat_bp.route("/no_leidos/<int:receptor_id>", methods=["GET"])
def obtener_no_leidos(receptor_id):
    try:
        count = contar_mensajes_no_leidos(receptor_id)
        return jsonify({
            "success": True,
            "mensajes_no_leidos": count
        })
        
    except Exception as e:
        print(f"Error al contar mensajes no leídos: {e}")
        return jsonify({"success": False, "error": "Error interno del servidor"}), 500

# Obtener conversaciones con información de no leídos (nueva versión mejorada)
@chat_bp.route("/conversaciones_mejoradas/<int:usuario_id>", methods=["GET"])
def obtener_conversaciones_mejoradas(usuario_id):
    try:
        conversaciones = obtener_conversaciones_con_no_leidos(usuario_id)
        
        # Obtener información completa de usuarios desde MySQL
        from bd import obtener_conexion
        conexion = obtener_conexion()
        
        resultado = []
        for conv in conversaciones:
            id_otro_usuario = conv["_id"]
            
            with conexion.cursor() as cursor:
                cursor.execute("""
                    SELECT username, email, foto, primer_nombre, primer_apellido
                    FROM usuario 
                    WHERE id_usuario = %s
                """, (id_otro_usuario,))
                
                columns = [col[0] for col in cursor.description]
                usuario_data = cursor.fetchone()
                
                if usuario_data:
                    usuario_info = dict(zip(columns, usuario_data))
                    resultado.append({
                        "id_usuario": id_otro_usuario,
                        "username": usuario_info["username"],
                        "email": usuario_info["email"],
                        "foto_usuario": usuario_info["foto"],
                        "nombre_completo": f"{usuario_info['primer_nombre'] or ''} {usuario_info['primer_apellido'] or ''}".strip(),
                        "ultimo_mensaje": conv["ultimo_mensaje"],
                        "fecha_ultimo": conv["fecha_ultimo"].strftime("%Y-%m-%d %H:%M:%S"),
                        "mensajes_no_leidos": conv["mensajes_no_leidos"]
                    })
        
        conexion.close()
        return jsonify(resultado)
        
    except Exception as e:
        print(f"Error al obtener conversaciones mejoradas: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500
