from funciones_chat import lista_mensajes_chat
from datetime import datetime

msgs = lista_mensajes_chat(1, 2)
ultimo = msgs[-1] if msgs else None

if ultimo:
    print(f"Último mensaje: {ultimo.get('contenido')}")
    print(f"Fecha guardada: {ultimo.get('fecha_envio')}")
    print(f"Hora actual: {datetime.now()}")
    
    # Calcular diferencia
    fecha_msg = ultimo.get('fecha_envio')
    if isinstance(fecha_msg, str):
        fecha_msg = datetime.strptime(fecha_msg, '%Y-%m-%d %H:%M:%S')
    elif hasattr(fecha_msg, 'replace'):
        # Es un objeto datetime de MongoDB
        fecha_msg = fecha_msg.replace(tzinfo=None)
    
    diferencia = datetime.now() - fecha_msg
    print(f"Diferencia: {diferencia.total_seconds()} segundos")
else:
    print("No hay mensajes")