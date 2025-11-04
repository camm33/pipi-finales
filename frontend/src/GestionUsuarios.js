import React, { useState, useEffect } from 'react';
import './GestionUsuarios.css';

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/usuarios', {
        credentials: 'include',
        headers: {
          'X-Id-Rol': localStorage.getItem('id_rol') || '',
          'X-Id-Usuario': localStorage.getItem('id_usuario') || '',
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsuarios(data.usuarios || []);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEstadoUsuario = async (idUsuario, estadoActual) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/usuarios/${idUsuario}/toggle`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Id-Rol': localStorage.getItem('id_rol') || '',
          'X-Id-Usuario': localStorage.getItem('id_usuario') || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: !estadoActual })
      });
      
      if (response.ok) {
        fetchUsuarios(); // Recargar lista
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
    usuario.email?.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) return <div className="loading">Cargando usuarios...</div>;

  return (
    <div className="gestion-usuarios-container">
      <header className="gestion-header">
        <h1>👤 Gestión de Usuarios</h1>
        <p>Administra y supervisa todos los usuarios registrados</p>
      </header>

      <div className="filtros-section">
        <input
          type="text"
          placeholder="🔍 Buscar usuarios por nombre o email..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="filtro-input"
        />
      </div>

      <div className="usuarios-grid">
        {usuariosFiltrados.length === 0 ? (
          <div className="empty-state">
            <p>No se encontraron usuarios</p>
          </div>
        ) : (
          usuariosFiltrados.map(usuario => (
            <div key={usuario.id_usuario} className="usuario-card">
              <div className="usuario-avatar">
                <img 
                  src={usuario.foto_perfil || '/default-avatar.png'} 
                  alt={usuario.nombre}
                  onError={(e) => e.target.src = '/default-avatar.png'}
                />
              </div>
              <div className="usuario-info">
                <h3>{usuario.nombre || 'Sin nombre'}</h3>
                <p className="usuario-email">{usuario.email}</p>
                <p className="usuario-fecha">
                  Registrado: {new Date(usuario.fecha_registro).toLocaleDateString()}
                </p>
                <div className="usuario-stats">
                  <span>📱 Teléfono: {usuario.telefono || 'No especificado'}</span>
                  <span>👕 Talla: {usuario.talla || 'No especificada'}</span>
                </div>
              </div>
              <div className="usuario-acciones">
                <span className={`estado-badge ${usuario.activo ? 'activo' : 'inactivo'}`}>
                  {usuario.activo ? '✅ Activo' : '❌ Inactivo'}
                </span>
                <button
                  onClick={() => toggleEstadoUsuario(usuario.id_usuario, usuario.activo)}
                  className={`btn-toggle ${usuario.activo ? 'btn-desactivar' : 'btn-activar'}`}
                >
                  {usuario.activo ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="stats-footer">
        <div className="stat-item">
          <span className="stat-number">{usuarios.length}</span>
          <span className="stat-label">Total Usuarios</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{usuarios.filter(u => u.activo).length}</span>
          <span className="stat-label">Activos</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{usuarios.filter(u => !u.activo).length}</span>
          <span className="stat-label">Inactivos</span>
        </div>
      </div>
    </div>
  );
};

export default GestionUsuarios;