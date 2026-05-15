"use client";
import { useState } from "react";

const categorias = ["Todas", "Restaurante", "Cafetería", "Postres", "Italiano", "Moderno"];

const plantillas = [
  { id: 1, nombre: "Clásico Elegante", categoria: "Restaurante", color: "#f5f0e8", textColor: "#2c1810", emoji: "🍽️", popular: false },
  { id: 2, nombre: "Moderno Minimalista", categoria: "Moderno", color: "#1a1a1a", textColor: "#ffffff", emoji: "⬛", popular: true },
  { id: 3, nombre: "Cafetería Vintage", categoria: "Cafetería", color: "#3d2b1f", textColor: "#f5deb3", emoji: "☕", popular: false },
  { id: 4, nombre: "Pastelería Dulce", categoria: "Postres", color: "#fce4ec", textColor: "#880e4f", emoji: "🍰", popular: true },
  { id: 5, nombre: "Restaurante Italiano", categoria: "Italiano", color: "#1b5e20", textColor: "#ffffff", emoji: "🍝", popular: false },
  { id: 6, nombre: "Brunch Moderno", categoria: "Moderno", color: "#fff8e1", textColor: "#4e342e", emoji: "🍳", popular: false },
  { id: 7, nombre: "Mariscos Frescos", categoria: "Restaurante", color: "#e3f2fd", textColor: "#0d47a1", emoji: "🦞", popular: false },
  { id: 8, nombre: "Tacos & Antojitos", categoria: "Restaurante", color: "#fff3e0", textColor: "#bf360c", emoji: "🌮", popular: true },
];

const navItems = [
  { icon: "⊞", label: "Dashboard", href: "/" },
  { icon: "☰", label: "Mis Menús", href: "/mis-menus" },
  { icon: "▦", label: "Plantillas", href: "/plantillas" },
  { icon: "✏️", label: "Mis Diseños", href: "#" },
  { icon: "🖼️", label: "Medios", href: "#" },
  { icon: "🏢", label: "Mi Negocio", href: "#" },
  { icon: "💳", label: "Facturación", href: "/planes" },
  { icon: "⚙️", label: "Configuración", href: "#" },
];

export default function Plantillas() {
  const [activeNav] = useState("Plantillas");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");

  const plantillasFiltradas = plantillas.filter((p) => {
    const coincideCategoria = categoriaActiva === "Todas" || p.categoria === categoriaActiva;
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
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
              color: "white", fontWeight: "bold", fontSize: 16,
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
            <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: 0 }}>Plantillas</h1>
            <p style={{ color: "#666", fontSize: 13, margin: "4px 0 0" }}>Elige una plantilla para empezar tu menú</p>
          </div>
          <input
            type="text"
            placeholder="🔍 Buscar plantillas..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8,
              padding: "10px 16px", color: "white", fontSize: 13, outline: "none", width: 220,
            }}
          />
        </div>

        {/* Categorías */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {categorias.map((cat) => (
            <button key={cat} onClick={() => setCategoriaActiva(cat)} style={{
              background: categoriaActiva === cat ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#1e1e28",
              border: categoriaActiva === cat ? "none" : "1px solid #2a2a35",
              borderRadius: 20, padding: "8px 18px",
              color: categoriaActiva === cat ? "white" : "#888",
              cursor: "pointer", fontSize: 13, fontWeight: categoriaActiva === cat ? 600 : 400,
            }}>{cat}</button>
          ))}
        </div>

        {/* Grid de plantillas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {plantillasFiltradas.map((p) => (
            <div key={p.id} style={{ position: "relative" }}
              onMouseEnter={e => {
                const overlay = e.currentTarget.querySelector(".overlay") as HTMLElement;
                if (overlay) overlay.style.opacity = "1";
              }}
              onMouseLeave={e => {
                const overlay = e.currentTarget.querySelector(".overlay") as HTMLElement;
                if (overlay) overlay.style.opacity = "0";
              }}
            >
              {/* Badge popular */}
              {p.popular && (
                <div style={{
                  position: "absolute", top: 10, right: 10, zIndex: 2,
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  borderRadius: 20, padding: "3px 10px",
                  color: "white", fontSize: 10, fontWeight: 700,
                }}>⭐ Popular</div>
              )}

              {/* Card */}
              <div style={{
                background: p.color, borderRadius: 12, overflow: "hidden",
                border: "1px solid #2a2a35", cursor: "pointer",
                aspectRatio: "3/4", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 12,
                position: "relative",
              }}>
                <div style={{ fontSize: 48 }}>{p.emoji}</div>
                <div style={{
                  fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 16,
                  color: p.textColor, textAlign: "center", padding: "0 16px",
                }}>MENÚ</div>
                <div style={{
                  color: p.textColor, opacity: 0.6, fontSize: 11,
                  textAlign: "center", padding: "0 16px",
                }}>
                  — Entradas —<br />
                  — Platos Fuertes —<br />
                  — Postres —
                </div>

                {/* Overlay hover */}
                <div className="overlay" style={{
                  position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", gap: 10, opacity: 0,
                  transition: "opacity 0.2s", borderRadius: 12,
                }}>
                  <button style={{
                    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                    border: "none", borderRadius: 8, padding: "10px 20px",
                    color: "white", fontWeight: 600, fontSize: 13, cursor: "pointer", width: 140,
                  }}>Usar plantilla</button>
                  <button style={{
                    background: "transparent", border: "1px solid #ffffff44",
                    borderRadius: 8, padding: "10px 20px",
                    color: "white", fontSize: 13, cursor: "pointer", width: 140,
                  }}>Vista previa</button>
                </div>
              </div>

              {/* Nombre */}
              <div style={{ marginTop: 10 }}>
                <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{p.nombre}</div>
                <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>{p.categoria}</div>
              </div>
            </div>
          ))}

          {/* Crear desde cero */}
          <div style={{
            border: "2px dashed #2a2a35", borderRadius: 12, cursor: "pointer",
            aspectRatio: "3/4", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 8,
            transition: "border-color 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#a855f7")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a35")}
          >
            <div style={{ fontSize: 36, color: "#a855f7" }}>+</div>
            <div style={{ color: "#666", fontSize: 13 }}>Crear desde cero</div>
          </div>
        </div>

      </main>
    </div>
  );
}