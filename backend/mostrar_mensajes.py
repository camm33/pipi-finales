from mongodb import connectionBD
from datetime import datetime

def mostrar_estructura_actual():
    """Muestra algunos mensajes con la nueva estructura"""
    try:
        collection = connectionBD()
        if collection is None:
            print("Error: No se pudo conectar a MongoDB")
            return
            
        print("=== ESTRUCTURA ACTUAL DE MENSAJES EN MONGODB ===\n")
        
        # Mostrar algunos mensajes de ejemplo
        mensajes = collection.find().limit(3).sort("fecha_envio", -1)
        
        for i, msg in enumerate(mensajes, 1):
            estado_lectura = "✓✓" if msg.get("leido", False) else "✓"
            
            print(f"Mensaje {i}:")
            print(f"  _id: {msg['_id']}")
            print(f"  emisor_id: {msg.get('emisor_id')}")
            print(f"  receptor_id: {msg.get('receptor_id')}")
            print(f"  contenido: \"{msg.get('contenido')}\"")
            print(f"  fecha_envio: {msg.get('fecha_envio')}")
            print(f"  leido: {msg.get('leido', False)} {estado_lectura}")
            print()
            
        # Estadísticas
        total = collection.count_documents({})
        no_leidos = collection.count_documents({"leido": False})
        leidos = collection.count_documents({"leido": True})
        
        print("=== ESTADÍSTICAS ===")
        print(f"Total de mensajes: {total}")
        print(f"Mensajes no leídos: {no_leidos} ✓")
        print(f"Mensajes leídos: {leidos} ✓✓")
        
    except Exception as e:
        print(f"Error: {e}")

def ejemplo_estructura_deseada():
    """Muestra la estructura que solicitaste"""
    print("=== ESTRUCTURA DESEADA (EJEMPLO) ===\n")
    
    ejemplo = {
        "_id": "ObjectId('6720f3b7a2f9b123456789ab')",
        "emisor_id": "6710e6cba1c9b12345678901", 
        "receptor_id": "6710e6cba1c9b12345678902",
        "contenido": "Hola! ¿Cómo estás?",
        "fecha_envio": "ISODate('2025-10-29T15:35:00Z')",
        "leido": "✓✓ (dos chulitos)"
    }
    
    for campo, valor in ejemplo.items():
        print(f"  {campo}: {valor}")
    
    print("\n📝 NOTAS:")
    print("- Los IDs se guardan como enteros (por compatibilidad con MySQL)")
    print("- fecha_envio usa datetime UTC")
    print("- leido: false = ✓ (un chulito), true = ✓✓ (dos chulitos)")

if __name__ == "__main__":
    ejemplo_estructura_deseada()
    print("\n" + "="*50 + "\n")
    mostrar_estructura_actual()