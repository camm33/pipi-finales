from bd import obtener_conexion
from mongodb import connectionBD
from datetime import datetime
from bson import ObjectId

def get_usuarios():
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("SELECT id_usuario, username FROM usuario")
            columns = [col[0] for col in cursor.description]
            usuarios = [dict(zip(columns, row)) for row in cursor.fetchall()]
        conexion.close()
        return usuarios
    except Exception as e:
        print(f"Error al traer usuarios: {e}")
        return []


# --- Funciones del chat ---
def procesar_form_chat(emisor_id, receptor_id, contenido):
    try:
        collection = connectionBD()
        if collection is None:
            print("Error: No se pudo conectar a MongoDB")
            return False
            
        nuevo_mensaje = {
            "emisor_id": int(emisor_id),
            "receptor_id": int(receptor_id),
            "contenido": contenido,
            "fecha_envio": datetime.now(),  # Hora local para evitar confusión con zonas horarias
            "leido": False  # Estado de no leído por defecto
        }
        result = collection.insert_one(nuevo_mensaje)
        print(f"Mensaje insertado con ID: {result.inserted_id}")
        return bool(result.inserted_id)
    except Exception as e:
        print(f"Error al insertar mensaje: {e}")
        return False


def lista_mensajes_chat(emisor_id, receptor_id):
    try:
        collection = connectionBD()
        if collection is None:
            print("Error: No se pudo conectar a MongoDB")
            return []
            
        # Traer mensajes entre dos usuarios (conversación)
        mensajes = collection.find({
            "$or": [
                {"emisor_id": int(emisor_id), "receptor_id": int(receptor_id)},
                {"emisor_id": int(receptor_id), "receptor_id": int(emisor_id)}
            ]
        }).sort("fecha_envio", 1)  # Orden ascendente por fecha

        # Obtener información de usuarios
        usuarios_data = get_usuarios()
        usuarios = {u["id_usuario"]: u["username"] for u in usuarios_data}

        lista_chat = []
        for msg in mensajes:
            # Asegurar que la fecha esté en formato correcto
            fecha_envio = msg["fecha_envio"]
            if hasattr(fecha_envio, 'strftime'):
                fecha_str = fecha_envio.strftime("%Y-%m-%d %H:%M:%S")
                fecha_corta = fecha_envio.strftime("%d-%m-%Y %H:%M")
            else:
                fecha_str = str(fecha_envio)
                fecha_corta = str(fecha_envio)
            
            lista_chat.append({
                "_id": str(msg["_id"]),
                "emisor_id": msg["emisor_id"],
                "receptor_id": msg["receptor_id"],
                "id_remitente": msg["emisor_id"],  # Mantener compatibilidad con frontend
                "id_destinatario": msg["receptor_id"],  # Mantener compatibilidad con frontend
                "remitente": usuarios.get(msg["emisor_id"], "Desconocido"),
                "destinatario": usuarios.get(msg["receptor_id"], "Desconocido"),
                "mensaje": msg["contenido"],
                "contenido": msg["contenido"],
                "fecha_envio": fecha_str,
                "fecha": fecha_corta,
                "leido": msg.get("leido", False)
            })
        
        print(f"Se encontraron {len(lista_chat)} mensajes entre usuarios {emisor_id} y {receptor_id}")
        return lista_chat
    except Exception as e:
        print(f"Error listando chat: {e}")
        return []


def marcar_mensajes_como_leidos(receptor_id, emisor_id):
    """Marcar todos los mensajes no leídos de emisor hacia receptor como leídos"""
    try:
        collection = connectionBD()
        if collection is None:
            print("Error: No se pudo conectar a MongoDB")
            return False
            
        # Marcar como leídos todos los mensajes que me envió el otro usuario
        result = collection.update_many(
            {
                "emisor_id": int(emisor_id),
                "receptor_id": int(receptor_id),
                "leido": False
            },
            {
                "$set": {"leido": True}
            }
        )
        
        print(f"Se marcaron {result.modified_count} mensajes como leídos")
        return True
        
    except Exception as e:
        print(f"Error marcando mensajes como leídos: {e}")
        return False


def contar_mensajes_no_leidos(receptor_id):
    """Contar mensajes no leídos para un usuario"""
    try:
        collection = connectionBD()
        if collection is None:
            print("Error: No se pudo conectar a MongoDB")
            return 0
            
        # Contar mensajes no leídos donde el usuario es el receptor
        count = collection.count_documents({
            "receptor_id": int(receptor_id),
            "leido": False
        })
        
        return count
        
    except Exception as e:
        print(f"Error contando mensajes no leídos: {e}")
        return 0


def obtener_conversaciones_con_no_leidos(usuario_id):
    """Obtener conversaciones con información de mensajes no leídos"""
    try:
        collection = connectionBD()
        if collection is None:
            print("Error: No se pudo conectar a MongoDB")
            return []
            
        # Pipeline para obtener conversaciones con conteo de no leídos
        pipeline = [
            {
                "$match": {
                    "$or": [
                        {"emisor_id": int(usuario_id)},
                        {"receptor_id": int(usuario_id)}
                    ]
                }
            },
            {
                "$group": {
                    "_id": {
                        "$cond": [
                            {"$eq": ["$emisor_id", int(usuario_id)]},
                            "$receptor_id",
                            "$emisor_id"
                        ]
                    },
                    "ultimo_mensaje": {"$last": "$contenido"},
                    "fecha_ultimo": {"$last": "$fecha_envio"},
                    "mensajes_no_leidos": {
                        "$sum": {
                            "$cond": [
                                {
                                    "$and": [
                                        {"$eq": ["$receptor_id", int(usuario_id)]},
                                        {"$eq": ["$leido", False]}
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {"$sort": {"fecha_ultimo": -1}}
        ]
        
        conversaciones = list(collection.aggregate(pipeline))
        return conversaciones
        
    except Exception as e:
        print(f"Error obteniendo conversaciones con no leídos: {e}")
        return []
