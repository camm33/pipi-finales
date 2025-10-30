from funciones_chat import lista_mensajes_chat

print("=== VERIFICACIÓN DE MENSAJES ===")
msgs = lista_mensajes_chat(1, 2)
print(f"Total mensajes en base: {len(msgs)}")

if msgs:
    print("\nÚltimos 5 mensajes:")
    for i, msg in enumerate(msgs[-5:], 1):
        contenido = msg.get('contenido', msg.get('mensaje', 'Sin contenido'))
        fecha = msg.get('fecha_envio')
        leido = msg.get('leido', False)
        print(f"{i}. {contenido}")
        print(f"   Fecha: {fecha}, Leído: {leido}")
        print()
else:
    print("❌ No se encontraron mensajes")

# Probar envío de nuevo mensaje
print("=== ENVIANDO MENSAJE DE PRUEBA ===")
from funciones_chat import procesar_form_chat
from datetime import datetime

hora_actual = datetime.now().strftime('%H:%M:%S')
contenido_prueba = f"Test frontend - {hora_actual}"

exito = procesar_form_chat(1, 2, contenido_prueba)
print(f"Envío exitoso: {exito}")

if exito:
    msgs_nuevos = lista_mensajes_chat(1, 2)
    ultimo = msgs_nuevos[-1] if msgs_nuevos else None
    if ultimo:
        print(f"Último mensaje: {ultimo.get('contenido', ultimo.get('mensaje'))}")
        print(f"Fecha: {ultimo.get('fecha_envio')}")
    print(f"Total mensajes ahora: {len(msgs_nuevos)}")