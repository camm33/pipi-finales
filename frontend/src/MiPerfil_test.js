import React, { useState, useEffect } from 'react';
import Header from './Header';
import './perfiles.css';

function MiPerfil() {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    console.log('TEST: useEffect iniciando');
    
    // Simulamos una carga de 2 segundos
    setTimeout(() => {
      console.log('TEST: Timeout completado');
      setUsuario({
        nombre: 'Usuario',
        apellido: 'Test',
        valoracion: 4,
        foto_perfil: null
      });
      setLoading(false);
    }, 2000);
  }, []);

  console.log('TEST: Renderizando componente, loading:', loading, 'usuario:', usuario);

  if (loading) {
    return (
      <div className="profile-container">
        <Header />
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando perfil de prueba...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Header />
      
      {/* Versión simplificada */}
      <div className="profile-main" style={{marginLeft: '0', padding: '20px'}}>
        <div style={{background: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center'}}>
          <h1>✅ Perfil Cargado Correctamente</h1>
          <p>Usuario: {usuario?.nombre} {usuario?.apellido}</p>
          <p>El componente está funcionando!</p>
          
          <div style={{marginTop: '20px'}}>
            <h3>Pruebas realizadas:</h3>
            <ul style={{textAlign: 'left', maxWidth: '400px', margin: '0 auto'}}>
              <li>✅ Importación de componentes</li>
              <li>✅ useState y useEffect</li>
              <li>✅ Renderizado condicional</li>
              <li>✅ CSS básico</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiPerfil;