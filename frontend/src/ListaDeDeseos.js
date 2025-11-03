import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from './Header';
import "./ListaDeDeseos.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default function ListaDeDeseos() {
  const [deseos, setDeseos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Recuperar lista según el usuario en sesión
  useEffect(() => {
    const idUsuario = localStorage.getItem("id_usuario");
    if (!idUsuario) {
      navigate("/iniciar_sesion");
      return;
    }

    const lista = JSON.parse(localStorage.getItem(`lista_deseos_${idUsuario}`)) || [];
    setDeseos(lista);
    setLoading(false);
  }, [navigate]);

  // ✅ Ver detalle de la prenda
  const handleVerMas = (id_prenda) => {
    navigate(`/ver_prenda/${id_prenda}`);
  };

  // ✅ Quitar prenda de la lista
  const handleQuitarDeseo = (id_publicacion) => {
    const idUsuario = localStorage.getItem("id_usuario");
    const nuevaLista = deseos.filter((d) => d.id_publicacion !== id_publicacion);
    setDeseos(nuevaLista);
    localStorage.setItem(`lista_deseos_${idUsuario}`, JSON.stringify(nuevaLista));
  };

  // ✅ Ir al catálogo principal
  const handleIrACatalogo = () => {
    navigate("/");
  };

  // ✅ Formatear precio
  const formatearPrecio = (valor) => {
    if (!valor) return "Intercambio";
    return `$${parseInt(valor).toLocaleString('es-CO')} COP`;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="lista-deseos-main">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando tus favoritos...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="lista-deseos-main">
        {/* Header de la página */}
        <div className="lista-deseos-header">
          <h1 className="lista-deseos-titulo">Lista de Deseos</h1>
          <p className="lista-deseos-subtitle">
            Tus prendas favoritas guardadas para después
          </p>
          <div className="lista-deseos-stats">
            <span className="stats-icon">💕</span>
            <span className="stats-text">
              {deseos.length} {deseos.length === 1 ? 'prenda favorita' : 'prendas favoritas'}
            </span>
          </div>
        </div>

        {/* Lista de prendas o estado vacío */}
        {deseos.length === 0 ? (
          <div className="lista-deseos-vacia">
            <div className="empty-icon">💔</div>
            <h3 className="empty-title">Tu lista está vacía</h3>
            <p className="empty-subtitle">
              Explora nuestro catálogo y guarda tus prendas favoritas
            </p>
            <button className="empty-action" onClick={handleIrACatalogo}>
              Explorar Catálogo
            </button>
          </div>
        ) : (
          <div className="lista-deseos-lista">
            {deseos.map((prod) => (
              <div key={prod.id_publicacion} className="lista-deseos-item">
                <div className="item-content">
                  <img
                    src={
                      prod.foto_url || 
                      `${BACKEND_URL}/uploads/${prod.foto}` ||
                      "/LOGO.png"
                    }
                    alt={prod.nombre_prenda}
                    className="lista-deseos-img"
                    onError={(e) => {
                      e.target.src = "/LOGO.png";
                    }}
                  />
                  <div className="lista-deseos-info">
                    <h3 className="lista-deseos-nombre">{prod.nombre_prenda}</h3>
                    <p className="lista-deseos-precio">
                      {formatearPrecio(prod.valor)}
                    </p>
                    <div className="item-actions">
                      <button
                        className="lista-deseos-vermas"
                        onClick={() => handleVerMas(prod.id_prenda)}
                      >
                        Ver Detalles
                      </button>
                      <button
                        className="lista-deseos-corazon"
                        onClick={() => handleQuitarDeseo(prod.id_publicacion)}
                        title="Quitar de favoritos"
                      >
                        <span className="heart-icon">❤️</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botón flotante para volver */}
        <button
          className="volver-btn"
          onClick={() => navigate(-1)}
          title="Volver"
        >
          ←
        </button>
      </div>
    </>
  );
}
