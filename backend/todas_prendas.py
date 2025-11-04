import bd

conn = bd.obtener_conexion()
cursor = conn.cursor()

# Buscar todas las prendas
cursor.execute("SELECT id_prenda, nombre, descripcion_prenda, foto FROM prenda")
result = cursor.fetchall()

print("Todas las prendas:")
for prenda in result:
    print(f"ID: {prenda[0]}, Nombre: '{prenda[1]}', Descripción: '{prenda[2]}', Foto: {prenda[3]}")

conn.close()