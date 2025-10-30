📌 Double P

Proyecto Double.p – Aplicación web con frontend y backend.

🚀 Descripción

Double.p es un proyecto diseñado para la gestión de prendas (crear, ver, editar y eliminar), pensado para un entorno web moderno. Incluye un backend (Flask) y un frontend (React).

📂 Estructura del proyecto
Double.p/
│── backend/        # Servidor (Flask o Express)
│── frontend/       # Aplicación React
│── README.md       # Documentación

⚙️ Requisitos previos

Antes de ejecutar el proyecto asegúrate de tener instalado:

Python 3.x

Node.js y npm

Git

(Opcional) MongoDB
 o MySQL según la base de datos usada

▶️ Instalación y ejecución
1. Clonar el repositorio
git clone https://github.com/tu-usuario/Double.p.git
cd Double.p

2. Backend

Entra a la carpeta backend e instala dependencias:

pip install -r requirements.txt   # Si es Flask
# o
npm install                       # Si es Express


Levantar servidor local:

flask run   # Flask
# o
npm start   # Express


Servidor por defecto:

Flask → http://127.0.0.1:5000/

Express → http://localhost:3000/

3. Frontend

Entra a la carpeta frontend:

npm install
npm start


Aplicación en:

http://localhost:3000/

🛠️ Tecnologías usadas

Frontend: React

Backend: Flask / Express

Base de datos: MongoDB / MySQL

Control de versiones: Git + GitHub

👩‍💻 Autores

Equipo Double.p

---

## Instalación en Windows (PowerShell) — pasos recomendados

Recomiendo crear un entorno virtual y usar `pip` para instalar las dependencias listadas en `requirements.txt`.

1) Crear y activar un virtualenv:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
```

2) Instalar dependencias:

```powershell
python -m pip install -r requirements.txt
```

3) Ejecutar el backend:

```powershell
cd backend
python app.py
```

Notas:
- Si la instalación de `Flask-MySQLdb` falla en Windows, `PyMySQL` puede funcionar como reemplazo. El `app.py` intenta instalar `PyMySQL` como `MySQLdb` automáticamente.
- Para envío de correos necesitas `Flask-Mail` y una App Password si usas Gmail; guarda las credenciales en variables de entorno.

Si quieres, puedo añadir un `.env.example` y cambiar `backend/app.py` para leer variables de entorno automáticamente.