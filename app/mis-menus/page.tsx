"use client";
import { useState } from "react";

const menus = [
  { id: 1, nombre: "Menú Restaurante", estado: "Publicado", vistas: 124, ultimaEdicion: "Hace 2 días", emoji: "🍽️" },
  { id: 2, nombre: "Menú Cafetería", estado: "Publicado", vistas: 98, ultimaEdicion: "Hace 5 días", emoji: "☕" },
  { id: 3, nombre: "Menú Postres", estado: "Borrador", vistas: 45, ultimaEdicion: "Hace 1 semana", emoji: "🍰" },
  { id: 4, nombre: "Menú Bebidas", estado: "Publicado", vistas: 67, ultimaEdicion: "Hace 2 semanas", emoji: "🥤" },
  { id: 5, nombre: "Menú Desayunos", estado: "Borrador", vistas: 23, ultimaEdicion: "Hace 3 semanas", emoji: "🍳" },
];

const navItems = [
  { icon: "⊞", label: "Dashboard", href: "/" },
  { icon: "☰", label: "Mis Menús", href: "/mis-menus" },
  { icon: "▦", label: "Plantillas", href: "/plantillas" },
  { icon: "✏️", label: "Mis Diseños", href: "/mis-disenos" },
  { icon: "🖼️", label: "Medios", href: "#" },
  { icon: "🏢", label: "Mi Negocio", href: "#" },
  { icon: "💳", label: "Facturación", href: "/planes" },
  { icon: "⚙️", label: "Configuración", href: "#" },
];

export default function MisMenus() {
  const [activeNav] = useState("Mis Menús");
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [menuViendo, setMenuViendo] = useState<typeof menus[0] | null>(null);
  const [confirmEliminar, setConfirmEliminar] = useState<number | null>(null);
  const [listaMenus, setListaMenus] = useState(menus);

  const menusFiltrados = listaMenus.filter((m) => {
    const coincideBusqueda = m.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFiltro = filtro === "Todos" || m.estado === filtro;
    return coincideBusqueda && coincideFiltro;
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#0f0f13" }}>

      {/* SIDEBAR */}
      <aside style={{
        width: 220, background: "#16161d", display: "flex", flexDirection: "column",
        padding: "24px 0", borderRight: "1px solid #2a2a35",
        position: "fixed", height: "100vh", zIndex: 10,
      }}>
        <div style={{ padding: "0 20px 28px", borderBottom: "1px solid #2a2a35" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: "bold", fontSize: 16
            }}>M</div>
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 15, lineHeight: 1 }}>MENU</div>
              <div style={{ color: "#a855f7", fontWeight: 700, fontSize: 15, lineHeight: 1 }}>MASTER</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => (
            <a key={item.label} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 8,
                background: activeNav === item.label ? "linear-gradient(135deg, #7c3aed22, #a855f722)" : "transparent",
                color: activeNav === item.label ? "#a855f7" : "#888",
                cursor: "pointer", fontSize: 13, fontWeight: activeNav === item.label ? 600 : 400,
                borderLeft: activeNav === item.label ? "2px solid #a855f7" : "2px solid transparent",
              }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </div>
            </a>
          ))}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: "1px solid #2a2a35" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", color: "#888", fontSize: 13, cursor: "pointer" }}>
            <span>🚪</span> Cerrar sesión
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: 220, flex: 1, padding: 32 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: 0 }}>Mis Menús</h1>
            <p style={{ color: "#666", fontSize: 13, margin: "4px 0 0" }}>Administra todos tus menús</p>
          </div>
          <button
            onClick={() => { localStorage.removeItem("plantilla_cargada"); window.location.href = "/editor"; }}
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              border: "none", borderRadius: 10, padding: "12px 20px",
              color: "white", fontWeight: 600, fontSize: 14, cursor: "pointer",
            }}
          >
            + Crear nuevo menú
          </button>
        </div>

        {/* Filtros y búsqueda */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "center" }}>
          <input
            type="text"
            placeholder="🔍 Buscar menú..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8,
              padding: "10px 16px", color: "white", fontSize: 13, outline: "none",
              width: 240,
            }}
          />
          {["Todos", "Publicado", "Borrador"].map((f) => (
            <button key={f} onClick={() => setFiltro(f)} style={{
              background: filtro === f ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#1e1e28",
              border: filtro === f ? "none" : "1px solid #2a2a35",
              borderRadius: 8, padding: "10px 16px",
              color: filtro === f ? "white" : "#888",
              cursor: "pointer", fontSize: 13, fontWeight: filtro === f ? 600 : 400,
            }}>{f}</button>
          ))}
        </div>

        {/* Tabla */}
        <div style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 12, overflow: "hidden" }}>

          {/* Encabezado tabla */}
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            padding: "14px 20px", borderBottom: "1px solid #2a2a35",
            color: "#555", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1,
          }}>
            <span>Nombre</span>
            <span>Estado</span>
            <span>Vistas</span>
            <span>Última edición</span>
            <span>Acciones</span>
          </div>

          {/* Filas */}
          {menusFiltrados.map((menu, i) => (
            <div key={menu.id} style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
              padding: "16px 20px",
              borderBottom: i < menusFiltrados.length - 1 ? "1px solid #2a2a35" : "none",
              alignItems: "center",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "#252530")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {/* Nombre */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: "#16161d", border: "1px solid #2a2a35",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                }}>{menu.emoji}</div>
                <span style={{ color: "white", fontSize: 14, fontWeight: 500 }}>{menu.nombre}</span>
              </div>

              {/* Estado */}
              <div>
                <span style={{
                  padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                  background: menu.estado === "Publicado" ? "#16a34a22" : "#ca8a0422",
                  color: menu.estado === "Publicado" ? "#4ade80" : "#fbbf24",
                  border: `1px solid ${menu.estado === "Publicado" ? "#16a34a44" : "#ca8a0444"}`,
                }}>{menu.estado}</span>
              </div>

              {/* Vistas */}
              <span style={{ color: "#aaa", fontSize: 14 }}>{menu.vistas}</span>

              {/* Última edición */}
              <span style={{ color: "#666", fontSize: 13 }}>{menu.ultimaEdicion}</span>

              {/* Acciones */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setMenuViendo(menu)}
                  style={{ background: "#16161d", border: "1px solid #2a2a35", borderRadius: 6, padding: "6px 10px", color: "#aaa", cursor: "pointer", fontSize: 14 }}
                  title="Ver"
                >👁️</button>
               <button
                  onClick={() => window.location.href = "/editor"}
                  style={{ background: "#16161d", border: "1px solid #2a2a35", borderRadius: 6, padding: "6px 10px", color: "#a855f7", cursor: "pointer", fontSize: 14 }}
                  title="Editar"
                >✏️</button>
               <button
                  onClick={() => setConfirmEliminar(menu.id)}
                  style={{ background: "#16161d", border: "1px solid #2a2a35", borderRadius: 6, padding: "6px 10px", color: "#f87171", cursor: "pointer", fontSize: 14 }}
                  title="Eliminar"
                >🗑️</button>
              </div>
            </div>
          ))}

          {menusFiltrados.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#555" }}>
              No se encontraron menús
            </div>
          )}
        </div>

        {/* Ver más */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button style={{
            background: "transparent", border: "1px solid #2a2a35",
            borderRadius: 8, padding: "10px 24px", color: "#888",
            cursor: "pointer", fontSize: 13,
          }}>Ver más</button>
        </div>

      </main>
      {/* MODAL VER MENÚ */}
{menuViendo && (
  <div onClick={() => setMenuViendo(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
    <div onClick={e => e.stopPropagation()} style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 16, padding: 28, width: 400, position: "relative" }}>
      <button onClick={() => setMenuViendo(null)} style={{ position: "absolute", top: 12, right: 12, background: "#16161d", border: "1px solid #2a2a35", borderRadius: "50%", width: 28, height: 28, color: "#aaa", cursor: "pointer", fontSize: 14 }}>✕</button>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <div style={{ fontSize: 40 }}>{menuViendo.emoji}</div>
        <div>
          <div style={{ color: "white", fontSize: 18, fontWeight: 700 }}>{menuViendo.nombre}</div>
          <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: menuViendo.estado === "Publicado" ? "#16a34a22" : "#ca8a0422", color: menuViendo.estado === "Publicado" ? "#4ade80" : "#fbbf24", border: `1px solid ${menuViendo.estado === "Publicado" ? "#16a34a44" : "#ca8a0444"}` }}>{menuViendo.estado}</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "#16161d", borderRadius: 8, padding: 14 }}>
          <div style={{ color: "#666", fontSize: 11, marginBottom: 4 }}>VISTAS</div>
          <div style={{ color: "white", fontSize: 22, fontWeight: 700 }}>{menuViendo.vistas}</div>
        </div>
        <div style={{ background: "#16161d", borderRadius: 8, padding: 14 }}>
          <div style={{ color: "#666", fontSize: 11, marginBottom: 4 }}>ÚLTIMA EDICIÓN</div>
          <div style={{ color: "white", fontSize: 14, fontWeight: 600 }}>{menuViendo.ultimaEdicion}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => { setMenuViendo(null); window.location.href = "/editor"; }} style={{ flex: 1, background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: 8, padding: "10px", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>✏️ Editar</button>
        <button onClick={() => setMenuViendo(null)} style={{ flex: 1, background: "transparent", border: "1px solid #2a2a35", borderRadius: 8, padding: "10px", color: "#aaa", cursor: "pointer", fontSize: 13 }}>Cerrar</button>
      </div>
    </div>
  </div>
)}

{/* MODAL CONFIRMAR ELIMINAR */}
{confirmEliminar !== null && (
  <div onClick={() => setConfirmEliminar(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
    <div onClick={e => e.stopPropagation()} style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 16, padding: 28, width: 360, textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
      <div style={{ color: "white", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>¿Eliminar este menú?</div>
      <div style={{ color: "#666", fontSize: 13, marginBottom: 24 }}>Esta acción no se puede deshacer.</div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => {
            setListaMenus(prev => prev.filter(m => m.id !== confirmEliminar));
            setConfirmEliminar(null);
          }}
          style={{ flex: 1, background: "#dc2626", border: "none", borderRadius: 8, padding: "10px", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
        >Sí, eliminar</button>
        <button onClick={() => setConfirmEliminar(null)} style={{ flex: 1, background: "transparent", border: "1px solid #2a2a35", borderRadius: 8, padding: "10px", color: "#aaa", cursor: "pointer", fontSize: 13 }}>Cancelar</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}