import React from "react";
import BotonPerfilUsuario from "./components/BotonPerfilUsuario";

// ==========================================
// EJEMPLOS DE USO DEL COMPONENTE BOTÓN PERFIL
// ==========================================

function EjemplosBotonPerfil() {
  
  // Datos de ejemplo
  const usuario1 = { id: 123, nombre: "Ana García" };
  const usuario2 = { id: 456, nombre: "Carlos López" };
  const usuario3 = { id: 789, nombre: "María Rodríguez" };

  // Función personalizada de click
  const handlePerfilClick = (userId, username) => {
    console.log(`Navegando al perfil de ${username} (ID: ${userId})`);
    // Aquí puedes agregar tu lógica personalizada
    // Por ejemplo: abrir modal, mostrar info, etc.
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>Ejemplos de uso - Botón Perfil Usuario</h2>
      
      {/* EJEMPLO 1: Uso básico (como en DetallePrenda) */}
      <div style={{ marginBottom: "30px" }}>
        <h3>1. Uso básico (con "Publicado por:")</h3>
        <BotonPerfilUsuario 
          userId={usuario1.id} 
          username={usuario1.nombre} 
        />
      </div>

      {/* EJEMPLO 2: Sin label */}
      <div style={{ marginBottom: "30px" }}>
        <h3>2. Solo botón (sin label)</h3>
        <BotonPerfilUsuario 
          userId={usuario2.id} 
          username={usuario2.nombre}
          showLabel={false}
          className="solo-boton"
        />
      </div>

      {/* EJEMPLO 3: Label personalizado */}
      <div style={{ marginBottom: "30px" }}>
        <h3>3. Con label personalizado</h3>
        <BotonPerfilUsuario 
          userId={usuario3.id} 
          username={usuario3.nombre}
          customLabel="Vendedor:"
        />
      </div>

      {/* EJEMPLO 4: Versión compacta y pequeña */}
      <div style={{ marginBottom: "30px" }}>
        <h3>4. Versión compacta y pequeña</h3>
        <BotonPerfilUsuario 
          userId={usuario1.id} 
          username={usuario1.nombre}
          customLabel="Autor:"
          className="compact small"
        />
      </div>

      {/* EJEMPLO 5: Con función personalizada */}
      <div style={{ marginBottom: "30px" }}>
        <h3>5. Con función personalizada de click</h3>
        <BotonPerfilUsuario 
          userId={usuario2.id} 
          username={usuario2.nombre}
          customLabel="Creador:"
          onClick={handlePerfilClick}
        />
      </div>

      {/* EJEMPLO 6: En una lista/grid */}
      <div style={{ marginBottom: "30px" }}>
        <h3>6. En una lista de elementos</h3>
        <div style={{ display: "grid", gap: "15px" }}>
          {[usuario1, usuario2, usuario3].map(user => (
            <div key={user.id} style={{ 
              padding: "15px", 
              border: "1px solid #eee", 
              borderRadius: "8px" 
            }}>
              <h4>Contenido del elemento...</h4>
              <BotonPerfilUsuario 
                userId={user.id} 
                username={user.nombre}
                customLabel="Por:"
                className="compact"
              />
            </div>
          ))}
        </div>
      </div>

      {/* EJEMPLO 7: Múltiples botones en línea */}
      <div style={{ marginBottom: "30px" }}>
        <h3>7. Múltiples usuarios en línea</h3>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <BotonPerfilUsuario 
            userId={usuario1.id} 
            username={usuario1.nombre}
            showLabel={false}
            className="solo-boton small"
          />
          <BotonPerfilUsuario 
            userId={usuario2.id} 
            username={usuario2.nombre}
            showLabel={false}
            className="solo-boton small"
          />
          <BotonPerfilUsuario 
            userId={usuario3.id} 
            username={usuario3.nombre}
            showLabel={false}
            className="solo-boton small"
          />
        </div>
      </div>

    </div>
  );
}

export default EjemplosBotonPerfil;

// ==========================================
// PARA COPIAR Y PEGAR EN OTROS PROYECTOS:
// ==========================================

/*
ARCHIVOS NECESARIOS:
1. BotonPerfilUsuario.js
2. BotonPerfilUsuario.css

IMPORTACIÓN:
import BotonPerfilUsuario from './ruta/a/BotonPerfilUsuario';

USO BÁSICO:
<BotonPerfilUsuario 
  userId={usuario.id} 
  username={usuario.nombre} 
/>

DEPENDENCIAS REQUERIDAS:
- React
- react-router-dom (para useNavigate)

INSTALACIÓN DE DEPENDENCIAS:
npm install react-router-dom

CONFIGURACIÓN ROUTER (en App.js):
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/perfil/:id" element={<PerfilComponent />} />
        // ... otras rutas
      </Routes>
    </BrowserRouter>
  );
}
*/