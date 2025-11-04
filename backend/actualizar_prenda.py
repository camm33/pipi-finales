import bd

conn = bd.obtener_conexion()
cursor = conn.cursor()

# Actualizar la prenda ID 1 para que tenga una imagen válida y un nombre mejor
cursor.execute("UPDATE prenda SET foto = 'sudadera1.jpg', nombre = 'Sudadera Calida Gris' WHERE id_prenda = 1")
conn.commit()

print("✅ Prenda actualizada exitosamente")

# Verificar el cambio
cursor.execute("SELECT id_prenda, nombre, foto FROM prenda WHERE id_prenda = 1")
result = cursor.fetchone()
print(f"Nueva prenda: ID: {result[0]}, Nombre: '{result[1]}', Foto: {result[2]}")

conn.close()