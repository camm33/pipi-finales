import bd

conn = bd.obtener_conexion()
cursor = conn.cursor()

# Ver la estructura de la tabla prenda
cursor.execute("DESCRIBE prenda")
columns = cursor.fetchall()

print("Columnas de la tabla 'prenda':")
for col in columns:
    print(f"- {col[0]} ({col[1]})")

print("\n" + "="*50)

# Buscar prendas con sueter o gris
cursor.execute("SELECT * FROM prenda LIMIT 5")
result = cursor.fetchall()

print("\nPrimeras 5 prendas (para ver datos de ejemplo):")
for prenda in result:
    print(prenda)

conn.close()