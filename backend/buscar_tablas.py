import bd

conn = bd.obtener_conexion()
cursor = conn.cursor()

# Mostrar todas las tablas
cursor.execute("SHOW TABLES")
tables = cursor.fetchall()

print("Tablas disponibles:")
for table in tables:
    print(f"- {table[0]}")

# Buscar tablas que puedan contener publicaciones
cursor.execute("SHOW TABLES LIKE '%publi%'")
publi_tables = cursor.fetchall()

print("\nTablas relacionadas con publicaciones:")
for table in publi_tables:
    print(f"- {table[0]}")

conn.close()