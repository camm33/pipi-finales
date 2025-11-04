import bd

conn = bd.obtener_conexion()
cursor = conn.cursor()

# Ver la estructura de la tabla publicacion
cursor.execute("DESCRIBE publicacion")
columns = cursor.fetchall()

print("Columnas de la tabla 'publicacion':")
for col in columns:
    print(f"- {col[0]} ({col[1]})")

conn.close()