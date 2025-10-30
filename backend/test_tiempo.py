from funciones_chat import lista_mensajes_chat
from datetime import datetime

# Obtener mensajes recientes
mensajes = lista_mensajes_chat(1, 2)

print("=== PRUEBA DE FORMATEO DE TIEMPO ===\n")

if mensajes:
    for i, msg in enumerate(mensajes[-3:], 1):  # Últimos 3 mensajes
        fecha_envio = msg.get('fecha_envio')
        contenido = msg.get('contenido', msg.get('mensaje', 'Sin contenido'))
        
        print(f"Mensaje {i}:")
        print(f"  Contenido: {contenido}")
        print(f"  Fecha original: {fecha_envio}")
        print(f"  Timestamp: {datetime.now()}")
        print(f"  Diferencia: {datetime.now() - datetime.fromisoformat(fecha_envio.replace('Z', '+00:00')) if 'T' in fecha_envio else datetime.now() - datetime.strptime(fecha_envio, '%Y-%m-%d %H:%M:%S')}")
        print()

print("=== Últimos 5 mensajes con timestamp ===")
for msg in mensajes[-5:]:
    print(f"- {msg.get('contenido', msg.get('mensaje'))}: {msg.get('fecha_envio')}")