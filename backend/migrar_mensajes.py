from mongodb import connectionBD
from datetime import datetime

def migrar_estructura_mensajes():
    """
    Migra los mensajes existentes a la nueva estructura:
    - id_remitente -> emisor_id
    - id_destinatario -> receptor_id  
    - mensaje -> contenido
    - fecha_mensaje -> fecha_envio (UTC)
    - Agrega campo 'leido' si no existe
    """
    try:
        collection = connectionBD()
        if collection is None:
            print("Error: No se pudo conectar a MongoDB")
            return False
        
        print("Iniciando migración de estructura de mensajes...")
        
        # Buscar todos los mensajes con la estructura antigua
        mensajes_antiguos = collection.find({
            "$or": [
                {"id_remitente": {"$exists": True}},
                {"mensaje": {"$exists": True}},
                {"fecha_mensaje": {"$exists": True}}
            ]
        })
        
        count = 0
        for msg in mensajes_antiguos:
            actualizaciones = {}
            
            # Migrar campos si existen en la estructura antigua
            if "id_remitente" in msg and "emisor_id" not in msg:
                actualizaciones["emisor_id"] = msg["id_remitente"]
                
            if "id_destinatario" in msg and "receptor_id" not in msg:
                actualizaciones["receptor_id"] = msg["id_destinatario"]
                
            if "mensaje" in msg and "contenido" not in msg:
                actualizaciones["contenido"] = msg["mensaje"]
                
            if "fecha_mensaje" in msg and "fecha_envio" not in msg:
                # Convertir a UTC si es datetime, mantener si ya es UTC
                fecha = msg["fecha_mensaje"]
                if isinstance(fecha, datetime):
                    actualizaciones["fecha_envio"] = fecha
                else:
                    actualizaciones["fecha_envio"] = datetime.utcnow()
                    
            # Agregar campo leido si no existe
            if "leido" not in msg:
                actualizaciones["leido"] = False
            
            # Aplicar actualizaciones si hay cambios
            if actualizaciones:
                collection.update_one(
                    {"_id": msg["_id"]},
                    {
                        "$set": actualizaciones,
                        "$unset": {
                            "id_remitente": "",
                            "id_destinatario": "", 
                            "mensaje": "",
                            "fecha_mensaje": ""
                        }
                    }
                )
                count += 1
                print(f"Migrado mensaje {msg['_id']}")
        
        print(f"Migración completada. Se actualizaron {count} mensajes.")
        
        # Mostrar ejemplo de la nueva estructura
        print("\nEjemplo de mensaje con nueva estructura:")
        ejemplo = collection.find_one({}, sort=[("fecha_envio", -1)])
        if ejemplo:
            print({
                "_id": ejemplo["_id"],
                "emisor_id": ejemplo.get("emisor_id"),
                "receptor_id": ejemplo.get("receptor_id"),
                "contenido": ejemplo.get("contenido"),
                "fecha_envio": ejemplo.get("fecha_envio"),
                "leido": ejemplo.get("leido")
            })
        
        return True
        
    except Exception as e:
        print(f"Error durante la migración: {e}")
        return False

def limpiar_mensajes_duplicados():
    """Eliminar campos antiguos que puedan haber quedado"""
    try:
        collection = connectionBD()
        if collection is None:
            print("Error: No se pudo conectar a MongoDB")
            return False
            
        result = collection.update_many(
            {},
            {
                "$unset": {
                    "id_remitente": "",
                    "id_destinatario": "",
                    "mensaje": "",
                    "fecha_mensaje": ""
                }
            }
        )
        
        print(f"Limpieza completada. Se limpiaron {result.modified_count} documentos.")
        return True
        
    except Exception as e:
        print(f"Error durante la limpieza: {e}")
        return False

if __name__ == "__main__":
    print("=== MIGRACIÓN DE ESTRUCTURA DE MENSAJES ===")
    print("Esta migración convertirá los mensajes a la nueva estructura:")
    print("- emisor_id, receptor_id, contenido, fecha_envio, leido")
    
    respuesta = input("\n¿Continuar con la migración? (s/n): ")
    
    if respuesta.lower() in ['s', 'si', 'y', 'yes']:
        if migrar_estructura_mensajes():
            print("\n✅ Migración exitosa!")
            
            limpieza = input("\n¿Realizar limpieza de campos antiguos? (s/n): ")
            if limpieza.lower() in ['s', 'si', 'y', 'yes']:
                limpiar_mensajes_duplicados()
                print("✅ Limpieza completada!")
        else:
            print("❌ Error en la migración")
    else:
        print("Migración cancelada.")