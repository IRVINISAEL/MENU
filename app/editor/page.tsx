"use client";
import { useState } from "react";

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

const herramientas = [
  { icon: "T", label: "Texto" },
  { icon: "▭", label: "Formas" },
  { icon: "🖼", label: "Imágenes" },
  { icon: "🎨", label: "Fondos" },
  { icon: "☰", label: "Capas" },
];

const secciones = [
  { id: 1, nombre: "ENTRADAS", platillos: [
    { nombre: "Bruschetta Clásica", precio: "$85" },
    { nombre: "Ensalada César", precio: "$90" },
    { nombre: "Sopa del Día", precio: "$70" },
  ]},
  { id: 2, nombre: "PLATOS FUERTES", platillos: [
    { nombre: "Salmón al Grill", precio: "$220" },
    { nombre: "Filete a la Parrilla", precio: "$250" },
    { nombre: "Pasta Alfredo", precio: "$180" },
  ]},
  { id: 3, nombre: "POSTRES", platillos: [
    { nombre: "Cheesecake de Fresa", precio: "$90" },
    { nombre: "Volcán de Chocolate", precio: "$95" },
    { nombre: "Tiramisú", precio: "$85" },
  ]},
];

const fuentes = ["Playfair Display", "Georgia", "Arial", "Montserrat", "Times New Roman"];
const colores = ["#000000", "#ffffff", "#7c3aed", "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#ec4899"];

export default function Editor() {
  const [herramientaActiva, setHerramientaActiva] = useState("Texto");
  const [fuenteActiva, setFuenteActiva] = useState("Playfair Display");
  const [colorActivo, setColorActivo] = useState("#000000");
  const [tamaño, setTamaño] = useState(48);
  const [guardado, setGuardado] = useState(true);
  const [seccionesData, setSeccionesData] = useState(secciones);
  const [editando, setEditando] = useState<{seccion: number, platillo: number, campo: string} | null>(null);

  const handleGuardar = () => {
    setGuardado(false);
    setTimeout(() => setGuardado(true), 1000);
  };

  const handleEditPlatillo = (seccionId: number, platilloIdx: number, campo: string, valor: string) => {
    setSeccionesData(prev => prev.map(s =>
      s.id === seccionId ? {
        ...s,
        platillos: s.platillos.map((p, i) =>
          i === platilloIdx ? { ...p, [campo]: valor } : p
        )
      } : s
    ));
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#0f0f13", overflow: "hidden" }}>

      {/* SIDEBAR IZQUIERDO - Herramientas */}
      <aside style={{
        width: 60, background: "#16161d", borderRight: "1px solid #2a2a35",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "16px 0", gap: 4, zIndex: 10,
      }}>
        {/* Logo pequeño */}
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: "bold", fontSize: 14, marginBottom: 16,
        }}>M</div>

        {herramientas.map((h) => (
          <button key={h.label} onClick={() => setHerramientaActiva(h.label)} style={{
            width: 44, height: 44, borderRadius: 8, border: "none",
            background: herramientaActiva === h.label ? "linear-gradient(135deg, #7c3aed22, #a855f722)" : "transparent",
            color: herramientaActiva === h.label ? "#a855f7" : "#666",
            cursor: "pointer", fontSize: herramientaActiva === h.label ? 18 : 16,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            borderLeft: herramientaActiva === h.label ? "2px solid #a855f7" : "2px solid transparent",
          }} title={h.label}>
            <span style={{ fontSize: 16 }}>{h.icon}</span>
          </button>
        ))}
      </aside>

      {/* PANEL CENTRAL */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* BARRA SUPERIOR */}
        <div style={{
          height: 56, background: "#16161d", borderBottom: "1px solid #2a2a35",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", gap: 12,
        }}>
          {/* Izquierda */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/mis-menus" style={{
              color: "#888", fontSize: 13, textDecoration: "none",
              display: "flex", alignItems: "center", gap: 6,
            }}>← Volver</a>
            <span style={{ color: "#2a2a35" }}>|</span>
            <span style={{ color: "white", fontSize: 14, fontWeight: 600 }}>Menú Restaurante</span>
            <span style={{
              background: guardado ? "#16a34a22" : "#ca8a0422",
              color: guardado ? "#4ade80" : "#fbbf24",
              border: `1px solid ${guardado ? "#16a34a44" : "#ca8a0444"}`,
              borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600,
            }}>{guardado ? "● Guardado" : "● Guardando..."}</span>
          </div>

          {/* Centro - opciones de texto */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <select value={fuenteActiva} onChange={e => setFuenteActiva(e.target.value)} style={{
              background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 6,
              color: "white", padding: "4px 8px", fontSize: 12, outline: "none",
            }}>
              {fuentes.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <input type="number" value={tamaño} onChange={e => setTamaño(Number(e.target.value))} style={{
              width: 50, background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 6,
              color: "white", padding: "4px 8px", fontSize: 12, outline: "none", textAlign: "center",
            }} />
            {["B", "I", "U"].map(f => (
              <button key={f} style={{
                width: 28, height: 28, background: "#1e1e28", border: "1px solid #2a2a35",
                borderRadius: 6, color: "#aaa", cursor: "pointer", fontSize: 12, fontWeight: "bold",
              }}>{f}</button>
            ))}
          </div>

          {/* Derecha */}
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{
              background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8,
              color: "#aaa", padding: "8px 14px", cursor: "pointer", fontSize: 12,
            }}>👁 Vista previa</button>
            <button style={{
              background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8,
              color: "#aaa", padding: "8px 14px", cursor: "pointer", fontSize: 12,
            }}>⬇ Descargar</button>
            <button onClick={handleGuardar} style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none",
              borderRadius: 8, color: "white", padding: "8px 16px",
              cursor: "pointer", fontSize: 12, fontWeight: 600,
            }}>Publicar</button>
          </div>
        </div>

        {/* ÁREA DEL EDITOR */}
        <div style={{
          flex: 1, overflow: "auto", background: "#0a0a0e",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 32,
        }}>
          {/* Canvas del menú */}
          <div style={{
            width: 420, minHeight: 600,
            background: "linear-gradient(135deg, #fefefe, #f8f4ee)",
            borderRadius: 4, boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            padding: 32, fontFamily: fuenteActiva,
            position: "relative",
          }}>
            {/* Título del menú */}
            <div style={{ textAlign: "center", marginBottom: 24, borderBottom: "2px solid #2c1810", paddingBottom: 16 }}>
              <div style={{ fontSize: 11, letterSpacing: 4, color: "#888", marginBottom: 4 }}>✦ ✦ ✦</div>
              <h1 style={{
                fontSize: tamaño / 2.5, fontFamily: fuenteActiva,
                color: "#2c1810", margin: 0, fontWeight: 700, letterSpacing: 3,
              }}>MENÚ</h1>
              <h2 style={{
                fontSize: tamaño / 4, fontFamily: fuenteActiva,
                color: "#8b4513", margin: "4px 0 0", fontWeight: 400, letterSpacing: 6,
              }}>RESTAURANTE</h2>
              <div style={{ fontSize: 11, letterSpacing: 4, color: "#888", marginTop: 8 }}>✦ ✦ ✦</div>
            </div>

            {/* Secciones editables */}
            {seccionesData.map((seccion) => (
              <div key={seccion.id} style={{ marginBottom: 20 }}>
                <h3 style={{
                  fontSize: 11, letterSpacing: 3, color: "#8b4513",
                  textAlign: "center", margin: "0 0 12px", fontWeight: 600,
                }}>{seccion.nombre}</h3>
                {seccion.platillos.map((platillo, idx) => (
                  <div key={idx} style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", marginBottom: 6, padding: "2px 0",
                    borderBottom: "1px dotted #ddd",
                  }}>
                    {editando?.seccion === seccion.id && editando?.platillo === idx && editando?.campo === "nombre" ? (
                      <input
                        autoFocus
                        value={platillo.nombre}
                        onChange={e => handleEditPlatillo(seccion.id, idx, "nombre", e.target.value)}
                        onBlur={() => setEditando(null)}
                        style={{
                          background: "transparent", border: "none", borderBottom: "2px solid #a855f7",
                          outline: "none", fontSize: 12, color: "#2c1810",
                          fontFamily: fuenteActiva, flex: 1,
                        }}
                      />
                    ) : (
                      <span
                        onClick={() => setEditando({ seccion: seccion.id, platillo: idx, campo: "nombre" })}
                        style={{ fontSize: 12, color: "#2c1810", cursor: "text", flex: 1 }}
                        title="Clic para editar"
                      >{platillo.nombre}</span>
                    )}
                    {editando?.seccion === seccion.id && editando?.platillo === idx && editando?.campo === "precio" ? (
                      <input
                        autoFocus
                        value={platillo.precio}
                        onChange={e => handleEditPlatillo(seccion.id, idx, "precio", e.target.value)}
                        onBlur={() => setEditando(null)}
                        style={{
                          background: "transparent", border: "none", borderBottom: "2px solid #a855f7",
                          outline: "none", fontSize: 12, color: "#8b4513",
                          fontFamily: fuenteActiva, width: 60, textAlign: "right",
                        }}
                      />
                    ) : (
                      <span
                        onClick={() => setEditando({ seccion: seccion.id, platillo: idx, campo: "precio" })}
                        style={{ fontSize: 12, color: "#8b4513", fontWeight: 600, cursor: "text", marginLeft: 8 }}
                        title="Clic para editar"
                      >{platillo.precio}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* BARRA INFERIOR - Zoom */}
        <div style={{
          height: 40, background: "#16161d", borderTop: "1px solid #2a2a35",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
        }}>
          <button style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 6, color: "#aaa", width: 28, height: 28, cursor: "pointer", fontSize: 16 }}>−</button>
          <span style={{ color: "#666", fontSize: 12 }}>100%</span>
          <button style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 6, color: "#aaa", width: 28, height: 28, cursor: "pointer", fontSize: 16 }}>+</button>
        </div>
      </div>

      {/* PANEL DERECHO - Propiedades */}
      <aside style={{
        width: 220, background: "#16161d", borderLeft: "1px solid #2a2a35",
        padding: 16, display: "flex", flexDirection: "column", gap: 20, overflowY: "auto",
      }}>
        {/* Color */}
        <div>
          <div style={{ color: "#666", fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 10 }}>COLOR</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {colores.map(c => (
              <div key={c} onClick={() => setColorActivo(c)} style={{
                width: 24, height: 24, borderRadius: 6, background: c, cursor: "pointer",
                border: colorActivo === c ? "2px solid #a855f7" : "2px solid #2a2a35",
              }} />
            ))}
          </div>
        </div>

        {/* Espaciado */}
        <div>
          <div style={{ color: "#666", fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 10 }}>ESPACIADO</div>
          <input type="range" min={1} max={3} step={0.1} defaultValue={1.2} style={{ width: "100%", accentColor: "#a855f7" }} />
        </div>

        {/* Capas */}
        <div>
          <div style={{ color: "#666", fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 10 }}>CAPAS</div>
          {["T MENÚ", "T RESTAURANTE", "☰ Entradas", "☰ Platos Fuertes", "☰ Postres"].map((capa, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 8px", borderRadius: 6, marginBottom: 2,
              background: i === 0 ? "#2a2a35" : "transparent",
              color: i === 0 ? "white" : "#888", fontSize: 12, cursor: "pointer",
            }}>
              <span style={{ fontSize: 10 }}>▶</span>
              {capa}
            </div>
          ))}
        </div>

        {/* Tip */}
        <div style={{
          background: "#7c3aed22", border: "1px solid #7c3aed44",
          borderRadius: 8, padding: 12,
        }}>
          <div style={{ color: "#a855f7", fontSize: 11, fontWeight: 600, marginBottom: 4 }}>💡 Tip</div>
          <div style={{ color: "#888", fontSize: 11, lineHeight: 1.5 }}>
            Da clic en cualquier texto del menú para editarlo directamente.
          </div>
        </div>
      </aside>

    </div>
  );
}