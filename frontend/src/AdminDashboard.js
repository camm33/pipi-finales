import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Temporal: comentar Bar para aislar el error
// import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./AdminDashboard.css";
// Temporal: reemplazar BeeCharacter problemático
// import BeeCharacter from "./BeeCharacter";

// Componente temporal simple para reemplazar BeeCharacter
const SimpleBee = ({ width = 120, height = 120 }) => (
  <div style={{ 
    width, 
    height, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    fontSize: '60px',
    animation: 'bounce 2s infinite'
  }}>
    🐝
  </div>
);

// Componente temporal para reemplazar Bar chart
const SimpleChart = ({ data }) => (
  <div style={{
    padding: '20px',
    textAlign: 'center',
    border: '2px dashed #ddd',
    borderRadius: '8px',
    background: '#f9f9f9'
  }}>
    <p>📊 Gráfico temporalmente deshabilitado</p>
    <p>Datos disponibles: {data ? 'Sí' : 'No'}</p>
  </div>
);

// Iconos SVG minimalistas
const UserIcon = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L12 2L3 7V9H4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V9H21ZM8 20V14H16V20H18V9H6V20H8Z"/>
  </svg>
);

const ClothingIcon = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12,2L8,6V8H6V20A2,2 0 0,0 8,22H16A2,2 0 0,0 18,20V8H16V6L12,2M12,4.2L14.8,7H9.2L12,4.2M8,9H16V20H8V9Z"/>
  </svg>
);

const PaymentIcon = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20,8H4A2,2 0 0,0 2,10V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V10A2,2 0 0,0 20,8M20,18H4V12H20V18M20,10H4V10H20V10M7,15H9V17H7V15M11,15H13V17H11V15Z"/>
  </svg>
);

const MessageIcon = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H5.17L4,17.17V4H20V16Z"/>
  </svg>
);

const ToggleIcon = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
  </svg>
);

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_usuarios: null,
    publicaciones_activas: null,
    numero_usuarios: null,
    numero_administradores: null,
  });
  const [loading, setLoading] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [adminName, setAdminName] = useState("Administrador");

  useEffect(() => {
    const nombreGuardado = localStorage.getItem("username");
    if (nombreGuardado) setAdminName(nombreGuardado);

    const headers = {
      "X-Id-Rol": localStorage.getItem("id_rol") || "",
      "X-Id-Usuario": localStorage.getItem("id_usuario") || "",
      "Content-Type": "application/json",
    };

    const fetchStats = async () => {
      try {
        const urls = [
          "http://localhost:5000/api/admin/total_usuarios",
          "http://localhost:5000/api/admin/publicaciones_activas",
          "http://localhost:5000/api/admin/numero_usuarios",
          "http://localhost:5000/api/admin/numero_administradores",
        ];
        const responses = await Promise.all(
          urls.map(async (url) => {
            const response = await fetch(url, {
              credentials: "include",
              headers,
              method: "GET",
            });
            const data = await response.json();
            return data;
          })
        );
        const [total, activas, usuarios, admins] = responses;
        setStats({
          total_usuarios: total.total_usuarios || "0",
          publicaciones_activas: activas.publicaciones_activas || "0",
          numero_usuarios: usuarios.numero_usuarios || "0",
          numero_administradores: admins.numero_administradores || "0",
        });
      } catch (e) {
        console.error("Error al cargar estadísticas:", e);
      }
      setLoading(false);
    };

    const fetchGrafico = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/publicaciones_tipo", {
          credentials: "include",
          headers,
          method: "GET",
        });
        const result = await res.json();
        if (result && result.ok && Array.isArray(result.data)) {
          const labels = result.data.map((item) => item.tipo);
          const valores = result.data.map((item) => item.total);
          const colores = [
            "#4CAF50", "#2196F3", "#FF9800", "#d037ebff",
            "#FF5722", "#3F51B5", "#00BCD4", "#CDDC39",
            "#E91E63", "#795548"
          ];
          setChartData({
            labels,
            datasets: [
              {
                label: "Cantidad de publicaciones",
                data: valores,
                backgroundColor: colores.slice(0, valores.length),
                borderRadius: 4,
              },
            ],
          });
        }
      } catch (err) {
        console.error("Error cargando gráfico:", err);
      }
    };

    fetchStats();
    fetchGrafico();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="dashboard-new-container">
      {/* Botón toggle para mostrar/ocultar sidebar */}
      <button
        className={`sidebar-toggle ${isSidebarVisible ? "sidebar-visible" : ""}`}
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
      >
        <ToggleIcon />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar-new ${!isSidebarVisible ? "hidden" : ""}`}>
        <div className="bee-header"></div>
        <nav className="menu-new">
          <Link to="/AdminDashboard/usuarios" className="menu-item-new" title="Gestión de Usuarios">
            <UserIcon />
          </Link>
          <Link to="/AdminDashboard/gestion-prendas" className="menu-item-new" title="Gestión de Prendas">
            <ClothingIcon />
          </Link>
          <Link to="/AdminDashboard/pagos" className="menu-item-new" title="Gestión de Pagos">
            <PaymentIcon />
          </Link>
          <Link to="/AdminDashboard/mensaje" className="menu-item-new" title="Gestión de Mensajes">
            <MessageIcon />
          </Link>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className={`content-new ${!isSidebarVisible ? "sidebar-hidden" : ""}`}>
        <section className="welcome-section">
          <div className="welcome-text">
            <h1>Hola, {adminName}</h1>
            <p>Bienvenid@ de nuevo a tu panel de administración</p>
          </div>
          {/* 🐝 Abeja animada al lado derecho */}
          <div className="bee-container">
            <div className="bee-wrapper">
              <SimpleBee width={120} height={120} />
              <div className="maya-speech">
                ¡Hola soy BeeP! ¿En qué trabajaremos hoy?
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="stat-card">Total usuarios <span>{stats.total_usuarios}</span></div>
          <div className="stat-card">Prendas activas <span>{stats.publicaciones_activas}</span></div>
          <div className="stat-card">Usuarios registrados <span>{stats.numero_usuarios}</span></div>
          <div className="stat-card">Administradores <span>{stats.numero_administradores}</span></div>
        </section>

        <section className="chart-report-section">
          <div className="chart-box">
            <h3>Gráfica de tipos de publicaciones</h3>
            <div className="chart-wrapper">
              <SimpleChart data={chartData} />
            </div>
          </div>

          <div className="reports-section-minimal">
            <h3>Reportes</h3>
            <div className="reports-grid-minimal">
              <div className="report-item">
                <span className="report-label">👤 Usuarios por talla</span>
                <button 
                  className="report-btn-minimal"
                  onClick={() => window.open("http://localhost:5000/api/reportes/usuarios_tallas", "_blank")}
                >
                  Descargar
                </button>
              </div>
              
              <div className="report-item">
                <span className="report-label">🛒 Prendas por talla</span>
                <button 
                  className="report-btn-minimal"
                  onClick={() => window.open("http://localhost:5000/api/reportes/publicaciones_tallas", "_blank")}
                >
                  Descargar
                </button>
              </div>
              
              <div className="report-item">
                <span className="report-label"> ✩ Valoraciones bajas</span>
                <button 
                  className="report-btn-minimal"
                  onClick={() => window.open("http://localhost:5000/api/reportes/peores_valoraciones", "_blank")}
                >
                  Descargar
                </button>
              </div>
              
              <div className="report-item">
                <span className="report-label">၊၊||၊ Análisis de precios</span>
                <button 
                  className="report-btn-minimal"
                  onClick={() => window.open("http://localhost:5000/api/reportes/caro_vs_economico", "_blank")}
                >
                  Descargar
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;