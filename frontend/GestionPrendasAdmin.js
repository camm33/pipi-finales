import React, { useState, useEffect } from 'react';
import HeaderAdmin from './HeaderAdmin';
import './ManagementTables.css';

const BACKEND_URL = "http://localhost:5000";

// Definimos los campos válidos que se pueden editar
const CAMPOS_VALIDOS = [
  'nombre',
  'nombre_prenda',
  'descripcion',
  'descripcion_prenda',
  'tipo',
  'tipo_publicacion',
  'estado',
  'estado_publicacion',
  'talla',
  'color',
  'marca',
  'fecha_publicacion',
  'fecha'
];

function GestionPrendasAdmin() {
  const [prendas, setPrendas] = useState([]);
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [tallaFiltro, setTallaFiltro] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [abierto, setAbierto] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    disponibles: 0,
    intercambiadas: 0,
    pendientes: 0
  });

  useEffect(() => {
    cargarPrendas();
  }, []);

  const cargarPrendas = async () => {
    try {
      setLoading(true);
      const headers = {
        "X-Id-Rol": localStorage.getItem("id_rol") || "",
        "X-Id-Usuario": localStorage.getItem("id_usuario") || "",
        "Content-Type": "application/json",
      };
      
      const response = await fetch(`${BACKEND_URL}/api/prendas`, {
        credentials: 'include',
        headers,
      });

      if (!response.ok) {
        throw new Error('Error al cargar prendas');
      }

      const data = await response.json();
      setPrendas(data);
      calcularEstadisticas(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setMensaje("Error al cargar prendas: " + error.message);
      setLoading(false);
    }
  };

  const calcularEstadisticas = (prendasData) => {
    const total = prendasData.length;
    const disponibles = prendasData.filter(p => 
      (p.estado || p.estado_publicacion || '').toLowerCase().includes('disponible')
    ).length;
    const intercambiadas = prendasData.filter(p => 
      (p.estado || p.estado_publicacion || '').toLowerCase().includes('intercambiado')
    ).length;
    const pendientes = prendasData.filter(p => 
      (p.estado || p.estado_publicacion || '').toLowerCase().includes('pendiente') ||
      (p.estado || p.estado_publicacion || '').toLowerCase().includes('negociación')
    ).length;

    setStats({ total, disponibles, intercambiadas, pendientes });
  };

  // Filtro de búsqueda y opciones
  const getFilteredPrendas = () => {
    return prendas.filter(prenda => {
      const nombre = (prenda.nombre || prenda.nombre_prenda || prenda.titulo || prenda.descripcion || '').toLowerCase();
      const estado = (prenda.estado || prenda.estado_publicacion || '').toLowerCase();
      const tipo = (prenda.tipo || prenda.tipo_publicacion || '').toLowerCase();
      const talla = (prenda.talla || '').toLowerCase();

      const searchMatch = search === '' || nombre.includes(search.toLowerCase());
      const estadoMatch = estadoFiltro === '' || estado === estadoFiltro.toLowerCase();
      const tipoMatch = tipoFiltro === '' || tipo === tipoFiltro.toLowerCase();
      const tallaMatch = tallaFiltro === '' || talla === tallaFiltro.toLowerCase();
      return searchMatch && estadoMatch && tipoMatch && tallaMatch;
    });
  };

  return (
    <div className="mg-container">
      {/* Encabezado */}
      <div
        className="mg-header-container"
        style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 16px rgba(191,160,116,0.10)',
          padding: '18px 24px',
          marginBottom: '24px',
          marginTop: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => window.history.back()}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '8px',
              borderRadius: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            ←
          </button>
          <h2 style={{ margin: 0, color: '#6d5d47', fontSize: '20px', fontWeight: '700' }}>
            Gestión de Prendas
          </h2>
          <span style={{ color: '#666', fontSize: '0.95rem' }}>Panel de solo lectura</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="text"
            placeholder="Buscar por nombre, tipo, estado..."
            className="mg-form-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              minWidth: 260,
              background: '#bfa074',
              color: '#222',
              fontWeight: '400',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px'
            }}
          />
          <button
            style={{
              background: '#bfa074',
              color: '#fff',
              fontWeight: '600',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 18px',
              fontSize: '1rem'
            }}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtros
          </button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div
          className="mg-filters"
          style={{
            marginTop: '16px',
            display: 'flex',
            gap: '32px',
            alignItems: 'center',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 16px rgba(191,160,116,0.10)',
            padding: '18px 24px',
            marginBottom: '24px'
          }}
        >
          <div>
            <label>Tipo de publicación:</label>
            <select value={tipoFiltro} onChange={e => setTipoFiltro(e.target.value)}>
              <option value="">Todos</option>
              <option value="venta">Venta</option>
              <option value="intercambio">Intercambio</option>
            </select>
          </div>
          <div>
            <label>Estado:</label>
            <select value={estadoFiltro} onChange={e => setEstadoFiltro(e.target.value)}>
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="disponible">Disponible</option>
              <option value="no disponible">No Disponible</option>
            </select>
          </div>
          <div>
            <label>Talla:</label>
            <select value={tallaFiltro} onChange={e => setTallaFiltro(e.target.value)}>
              <option value="">Todas</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>
          <button
            style={{
              background: '#bfa074',
              color: '#fff',
              fontWeight: '600',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 18px',
              fontSize: '1rem'
            }}
            onClick={() => {
              setTipoFiltro("");
              setEstadoFiltro("");
              setTallaFiltro("");
            }}
          >
            Limpiar
          </button>
        </div>
      )}

      {/* Tabla */}
      <div className="mg-table-centered">
        <table className="mg-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredPrendas().length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '48px 0', color: '#bfa074', fontSize: '1.2rem', fontWeight: '500', background: '#fffbe6', borderRadius: '12px' }}>
                  <div>
                    <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>🛒</span>
                    No hay prendas para mostrar.<br />
                    <span style={{ fontSize: '1rem', color: '#a88a5c' }}>Prueba quitando filtros o agrega nuevas prendas.</span>
                  </div>
                </td>
              </tr>
            ) : (
              getFilteredPrendas().map((prenda) => (
                <React.Fragment key={prenda.id || prenda.id_prenda}>
                  <tr>
                    <td>{prenda.nombre || prenda.nombre_prenda || prenda.descripcion || '-'}</td>
                    <td>{prenda.estado || prenda.estado_publicacion || '-'}</td>
                    <td>{prenda.tipo || prenda.tipo_publicacion || '-'}</td>
                    <td>
                      <button
                        style={{
                          width: '40px',
                          height: '40px',
                          background: '#a88a5c',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '2rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px #e5e7eb',
                          transition: 'background 0.2s'
                        }}
                        onClick={() =>
                          setAbierto(
                            abierto === (prenda.id || prenda.id_prenda)
                              ? null
                              : (prenda.id || prenda.id_prenda)
                          )
                        }
                        title={abierto === (prenda.id || prenda.id_prenda) ? 'Ocultar' : 'Ver detalles'}
                      >
                        {abierto === (prenda.id || prenda.id_prenda)
                          ? <span style={{fontSize:'1.5rem', fontWeight:'bold'}}>&minus;</span>
                          : <span style={{fontSize:'1.5rem', fontWeight:'bold'}}>+</span>}
                      </button>
                    </td>
                  </tr>
                  {abierto === (prenda.id || prenda.id_prenda) && (
                    <tr className="mg-desplegable-row">
                      <td colSpan={4}>
                        <div className="edit-panel">
                          <h3>Editar prenda</h3>
                          {mensaje && <div style={{marginBottom:12, color: mensaje.includes("Error") ? '#a00' : '#080', background:'#fff8f8', padding:8, borderRadius:6}}>{mensaje}</div>}
                          <form onSubmit={async (e) => {
                            e.preventDefault();
                            setMensaje("");
                            const headers = {
                              "X-Id-Rol": localStorage.getItem("id_rol") || "",
                              "X-Id-Usuario": localStorage.getItem("id_usuario") || "",
                              "Content-Type": "application/json",
                            };
                            const body = {};
                            const id_publicacion = prenda.id_publicacion;
                            const id = prenda.id || prenda.id_prenda;
                            Object.keys(prenda).forEach((field) => {
                              if (field === "id" || field === "id_prenda" || field === "id_publicacion") return;
                              if (e.target[field]) {
                                let value = e.target[field].value;
                                if ((field === "fecha_publicacion" || field === "fecha") && value) {
                                  const d = new Date(value);
                                  if (!isNaN(d.getTime())) {
                                    value = d.toISOString().slice(0, 10);
                                  }
                                }
                                body[field] = value;
                              }
                            });
                            if (Object.keys(body).length === 0) {
                              setMensaje("No hay cambios válidos para guardar.");
                              return;
                            }
                            try {
                              const res = await fetch(`http://localhost:5000/api/prendas/${id_publicacion}`, {
                                method: "PUT",
                                credentials: "include",
                                headers,
                                body: JSON.stringify(body),
                              });
                              if (!res.ok) {
                                const errorData = await res.json();
                                setMensaje(errorData.message || "Error al editar prenda.");
                                return;
                              }
                              const data = await res.json();
                              setPrendas(prev => prev.map(p => (p.id || p.id_prenda) === id ? data : p));
                              setMensaje("Prenda editada correctamente.");
                              setTimeout(() => setAbierto(null), 1200);
                            } catch (err) {
                              setMensaje("Error al editar prenda: " + err.message);
                            }
                          }}>
                            {Object.entries(prenda).map(([field, value]) => (
                              (field === "id" || field === "id_prenda" || field === "id_publicacion") ? null : (
                                <div key={field}>
                                  <label>{field.replace('_', ' ')}</label>
                                  {field === 'descripcion_prenda' || field === 'descripcion_publicacion' ? (
                                    <textarea name={field} defaultValue={value || ''} />
                                  ) : (
                                    <input type={field.includes('fecha') ? 'date' : 'text'} name={field} defaultValue={field.includes('fecha') ? (value ? new Date(value).toISOString().slice(0,10) : '') : (value || '')} />
                                  )}
                                </div>
                              )
                            ))}
                            <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
                              <button type="submit" className="mg-btn save">Guardar cambios</button>
                              <button type="button" className="mg-btn delete" onClick={async () => {
                                if (!window.confirm('¿Seguro que quieres borrar esta prenda?')) return;
                                const headers = {
                                  "X-Id-Rol": localStorage.getItem("id_rol") || "",
                                  "X-Id-Usuario": localStorage.getItem("id_usuario") || "",
                                  "Content-Type": "application/json",
                                };
                                try {
                                  const res = await fetch(`http://localhost:5000/api/prendas/${prenda.id_publicacion || prenda.id || prenda.id_prenda}`, {
                                    method: "DELETE",
                                    credentials: "include",
                                    headers,
                                  });
                                  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                                  setPrendas(prev => prev.filter(p => (p.id || p.id_prenda) !== (prenda.id || prenda.id_prenda)));
                                  setMensaje("Prenda eliminada correctamente.");
                                  setTimeout(() => { setMensaje(""); setAbierto(null); }, 1200);
                                } catch (err) {
                                  setMensaje("Error al borrar prenda: " + err.message);
                                }
                              }}>Eliminar</button>
                              <button type="button" className="mg-btn back" onClick={() => setAbierto(null)}>Cerrar</button>
                            </div>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GestionPrendasAdmin;