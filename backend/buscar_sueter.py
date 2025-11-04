import bd

conn = bd.obtener_conexion()
cursor = conn.cursor()

# Buscar prendas con sueter, gris o calido
cursor.execute("SELECT id_prenda, nombre, descripcion_prenda, foto, foto2, foto3, foto4 FROM prenda WHERE nombre LIKE '%sueter%' OR nombre LIKE '%gris%' OR nombre LIKE '%calido%' OR descripcion_prenda LIKE '%sueter%' OR descripcion_prenda LIKE '%gris%' OR descripcion_prenda LIKE '%calido%'")
result = cursor.fetchall()

print("Prendas encontradas con 'sueter', 'gris' o 'calido':")
for prenda in result:
    print(f"ID: {prenda[0]}, Nombre: {prenda[1]}, Descripción: {prenda[2]}")
    print(f"  - Foto: {prenda[3]}")
    print(f"  - Foto2: {prenda[4]}")
    print(f"  - Foto3: {prenda[5]}")
    print(f"  - Foto4: {prenda[6]}")
    print("-" * 50)

# Buscar por palabras sueltas también
cursor.execute("SELECT id_prenda, nombre, descripcion_prenda, foto FROM prenda WHERE nombre LIKE '%Sueter%' OR nombre LIKE '%suéter%'")
result2 = cursor.fetchall()

print("\nPrendas con 'Sueter' o 'suéter':")
for prenda in result2:
    print(f"ID: {prenda[0]}, Nombre: {prenda[1]}, Descripción: {prenda[2]}, Foto: {prenda[3]}")

conn.close()