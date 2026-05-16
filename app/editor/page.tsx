"use client";
import { useState, useRef, useCallback, useEffect } from "react";

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface Platillo {
  nombre: string;
  precio: string;
  desc?: string;
}

interface Seccion {
  id: number;
  nombre: string;
  platillos: Platillo[];
}

// ─── Datos iniciales ──────────────────────────────────────────────────────────
const initialSections: Seccion[] = [
  {
    id: 1, nombre: "ENTRADAS", platillos: [
      { nombre: "Bruschetta Clásica", precio: "$85", desc: "Tomate, albahaca y aceite de oliva" },
      { nombre: "Ensalada César", precio: "$90", desc: "" },
      { nombre: "Sopa del Día", precio: "$70", desc: "" },
    ],
  },
  {
    id: 2, nombre: "PLATOS FUERTES", platillos: [
      { nombre: "Salmón al Grill", precio: "$220", desc: "" },
      { nombre: "Filete a la Parrilla", precio: "$250", desc: "" },
      { nombre: "Pasta Alfredo", precio: "$180", desc: "" },
    ],
  },
  {
    id: 3, nombre: "POSTRES", platillos: [
      { nombre: "Cheesecake de Fresa", precio: "$90", desc: "" },
      { nombre: "Volcán de Chocolate", precio: "$95", desc: "" },
      { nombre: "Tiramisú", precio: "$85", desc: "" },
    ],
  },
];

const FONTS = ["Playfair Display", "Georgia", "Arial", "Montserrat", "Times New Roman"];
const COLORS = ["#2c1810", "#8b4513", "#ffffff", "#7c3aed", "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#000000"];
const BACKGROUNDS = [
  "linear-gradient(135deg, #fefefe, #f8f4ee)",
  "#1a1a2e",
  "linear-gradient(135deg, #fff9f0, #ffeedd)",
  "linear-gradient(135deg, #f0fff4, #dcfce7)",
];

const TOOLS = [
  { id: "select", icon: "↖", label: "Seleccionar (V)" },
  { id: "text",   icon: "T",  label: "Texto (T)" },
  { id: "shapes", icon: "▭",  label: "Formas" },
  { id: "images", icon: "🖼", label: "Imágenes" },
  { id: "bg",     icon: "🎨", label: "Fondos" },
];

// ─── Componente principal ─────────────────────────────────────────────────────
export default function EditorCanvasPro() {
  const [secciones, setSecciones]     = useState<Seccion[]>(initialSections);
  const [menuTitle, setMenuTitle]     = useState("Menú Restaurante");
  const [font, setFont]               = useState("Playfair Display");
  const [fontSize, setFontSize]       = useState(48);
  const [bold, setBold]               = useState(false);
  const [italic, setItalic]           = useState(false);
  const [underline, setUnderline]     = useState(false);
  const [activeColor, setActiveColor] = useState("#2c1810");
  const [activeBg, setActiveBg]       = useState(BACKGROUNDS[0]);
  const [zoom, setZoom]               = useState(0.88);
  const [activeTool, setActiveTool]   = useState("select");
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [guardado, setGuardado]       = useState(true);
  const [notify, setNotify]           = useState<string | null>(null);

  // Context menu
  const [ctxMenu, setCtxMenu] = useState<{
    x: number; y: number; secId: number; platIdx: number;
  } | null>(null);

  const canvasAreaRef = useRef<HTMLDivElement>(null);

  // ─── Zoom con Ctrl+Scroll ──────────────────────────────────────────────────
  useEffect(() => {
    const el = canvasAreaRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom(z => Math.min(2, Math.max(0.3, +(z + (e.deltaY < 0 ? 0.05 : -0.05)).toFixed(2))));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // ─── Cerrar ctx menu al hacer clic fuera ───────────────────────────────────
  useEffect(() => {
    const close = () => setCtxMenu(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  // ─── Notificación temporal ─────────────────────────────────────────────────
  const showNotify = (msg: string) => {
    setNotify(msg);
    setTimeout(() => setNotify(null), 2500);
  };

  // ─── Guardar / Publicar ────────────────────────────────────────────────────
  const handlePublicar = async () => {
    setGuardado(false);
    try {
      const usuarioData = localStorage.getItem("usuario");
      const usuario = usuarioData ? JSON.parse(usuarioData) : { id: 1 };
      const res = await fetch("https://menu-master-backend-production-9bfc.up.railway.app/api/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: menuTitle,
          estado: "Publicado",
          data_json: JSON.stringify(secciones),
          user_id: usuario.id || 1,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setGuardado(true);
        showNotify("✅ ¡Menú publicado!");
      } else {
        throw new Error("Error del servidor");
      }
    } catch {
      showNotify("❌ Error al guardar");
      setGuardado(true);
    }
  };

  // ─── Edición de platillos ──────────────────────────────────────────────────
  const updatePlatillo = (secId: number, pi: number, campo: keyof Platillo, valor: string) => {
    setSecciones(prev =>
      prev.map(s => s.id === secId
        ? { ...s, platillos: s.platillos.map((p, i) => i === pi ? { ...p, [campo]: valor } : p) }
        : s
      )
    );
  };

  const updateSeccionNombre = (secId: number, nombre: string) => {
    setSecciones(prev => prev.map(s => s.id === secId ? { ...s, nombre } : s));
  };

  const addPlatillo = (secId: number) => {
    setSecciones(prev =>
      prev.map(s => s.id === secId
        ? { ...s, platillos: [...s.platillos, { nombre: "Nuevo platillo", precio: "$0" }] }
        : s
      )
    );
  };

  const deletePlatillo = (secId: number, pi: number) => {
    setSecciones(prev =>
      prev.map(s => s.id === secId
        ? { ...s, platillos: s.platillos.filter((_, i) => i !== pi) }
        : s
      )
    );
  };

  const duplicatePlatillo = (secId: number, pi: number) => {
    setSecciones(prev =>
      prev.map(s => {
        if (s.id !== secId) return s;
        const copy = [...s.platillos];
        copy.splice(pi + 1, 0, { ...s.platillos[pi], nombre: s.platillos[pi].nombre + " (copia)" });
        return { ...s, platillos: copy };
      })
    );
  };

  const movePlatillo = (secId: number, pi: number, dir: -1 | 1) => {
    setSecciones(prev =>
      prev.map(s => {
        if (s.id !== secId) return s;
        const arr = [...s.platillos];
        const ni = pi + dir;
        if (ni < 0 || ni >= arr.length) return s;
        [arr[pi], arr[ni]] = [arr[ni], arr[pi]];
        return { ...s, platillos: arr };
      })
    );
  };

  const addSeccion = () => {
    const newId = Math.max(...secciones.map(s => s.id)) + 1;
    setSecciones(prev => [
      ...prev,
      { id: newId, nombre: "NUEVA SECCIÓN", platillos: [{ nombre: "Nuevo platillo", precio: "$0" }] },
    ]);
    showNotify("Sección agregada");
  };

  // ─── Estilos del canvas ────────────────────────────────────────────────────
  const canvasStyle: React.CSSProperties = {
    width: 400,
    minHeight: 560,
    background: activeBg,
    borderRadius: 3,
    boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
    padding: "30px 28px",
    fontFamily: font,
    position: "relative",
    cursor: "default",
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#0f0f13", overflow: "hidden" }}>

      {/* ─── Sidebar izquierdo ─── */}
      <aside style={{ width: 58, background: "#16161d", borderRight: "1px solid #222230", display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0", gap: 2, zIndex: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg, #7c3aed, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>M</div>

        {TOOLS.map(t => (
          <button key={t.id} onClick={() => setActiveTool(t.id)} title={t.label} style={{
            width: 42, height: 42, borderRadius: 8, border: "none",
            background: "transparent",
            color: activeTool === t.id ? "#a855f7" : "#555",
            borderLeft: `2px solid ${activeTool === t.id ? "#a855f7" : "transparent"}`,
            cursor: "pointer", fontSize: t.id === "text" ? 16 : 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .15s",
          }}>
            {t.icon}
          </button>
        ))}

        <div style={{ flex: 1 }} />
        <button title="Capas" style={{ width: 42, height: 42, borderRadius: 8, border: "none", background: "transparent", color: "#555", cursor: "pointer", fontSize: 18 }}>☰</button>
      </aside>

      {/* ─── Panel central ─── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Topbar */}
        <div style={{ height: 52, background: "#16161d", borderBottom: "1px solid #222230", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", gap: 10, flexShrink: 0 }}>

          {/* Izquierda */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a href="/mis-menus" style={{ color: "#666", fontSize: 12, textDecoration: "none" }}>← Mis Menús</a>
            <span style={{ color: "#333" }}>|</span>
            <input
              value={menuTitle}
              onChange={e => setMenuTitle(e.target.value)}
              style={{ background: "transparent", border: "none", color: "white", fontSize: 13, fontWeight: 600, outline: "none", width: 160 }}
            />
            <span style={{
              borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 600,
              background: guardado ? "#16a34a22" : "#ca8a0422",
              color: guardado ? "#4ade80" : "#fbbf24",
              border: `1px solid ${guardado ? "#16a34a44" : "#ca8a0444"}`,
            }}>
              {guardado ? "● Guardado" : "● Guardando..."}
            </span>
          </div>

          {/* Centro — formato */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <select value={font} onChange={e => setFont(e.target.value)} style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 6, color: "white", padding: "4px 6px", fontSize: 11, outline: "none" }}>
              {FONTS.map(f => <option key={f}>{f}</option>)}
            </select>
            <input type="number" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} min={8} max={120} style={{ width: 42, background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 6, color: "white", padding: "4px 6px", fontSize: 11, outline: "none", textAlign: "center" }} />
            {[
              { label: "B", key: "bold",      active: bold,      toggle: () => setBold(b => !b),           style: { fontWeight: "bold" as const } },
              { label: "I", key: "italic",    active: italic,    toggle: () => setItalic(b => !b),         style: { fontStyle: "italic" as const } },
              { label: "U", key: "underline", active: underline, toggle: () => setUnderline(b => !b),      style: { textDecoration: "underline" as const } },
            ].map(btn => (
              <button key={btn.key} onClick={btn.toggle} style={{
                width: 26, height: 26, background: btn.active ? "#7c3aed33" : "#1e1e28",
                border: `1px solid ${btn.active ? "#7c3aed55" : "#2a2a35"}`,
                borderRadius: 5, color: btn.active ? "#a855f7" : "#aaa", cursor: "pointer", fontSize: 11, ...btn.style,
              }}>{btn.label}</button>
            ))}
          </div>

          {/* Derecha */}
          <div style={{ display: "flex", gap: 7 }}>
            <button style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 7, color: "#aaa", padding: "6px 12px", cursor: "pointer", fontSize: 11 }}>👁 Vista previa</button>
            <button style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 7, color: "#aaa", padding: "6px 12px", cursor: "pointer", fontSize: 11 }}>⬇ Descargar</button>
            <button onClick={handlePublicar} style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: 7, color: "white", padding: "6px 14px", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Publicar</button>
          </div>
        </div>

        {/* Canvas area */}
        <div ref={canvasAreaRef} style={{ flex: 1, overflow: "auto", background: "#0a0a0e", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
          <div style={{ transform: `scale(${zoom})`, transformOrigin: "center center", padding: 40, transition: "transform .2s" }}>
            <div style={canvasStyle} onClick={() => setSelectedId(null)}>

              {/* Header del menú */}
              <div style={{ textAlign: "center", marginBottom: 24, borderBottom: "2px solid #2c1810", paddingBottom: 16 }}>
                <div style={{ fontSize: 10, letterSpacing: 4, color: "#bbb", marginBottom: 4 }}>✦ ✦ ✦</div>
                <h1
                  contentEditable
                  suppressContentEditableWarning
                  onClick={e => { e.stopPropagation(); setSelectedId("title"); }}
                  style={{
                    fontSize: fontSize / 2.5, fontFamily: font, color: "#2c1810",
                    margin: 0, fontWeight: bold ? 900 : 700, letterSpacing: 3,
                    fontStyle: italic ? "italic" : "normal",
                    textDecoration: underline ? "underline" : "none",
                    outline: selectedId === "title" ? "2px solid #a855f7" : "1.5px dashed transparent",
                    borderRadius: 4, padding: "2px 4px",
                  }}
                >MENÚ</h1>
                <h2
                  contentEditable
                  suppressContentEditableWarning
                  onClick={e => { e.stopPropagation(); setSelectedId("sub"); }}
                  style={{
                    fontSize: fontSize / 4, fontFamily: font, color: "#8b4513",
                    margin: "4px 0 0", fontWeight: 400, letterSpacing: 6,
                    outline: selectedId === "sub" ? "2px solid #a855f7" : "1.5px dashed transparent",
                    borderRadius: 4, padding: "2px 4px",
                  }}
                >RESTAURANTE</h2>
                <div style={{ fontSize: 10, letterSpacing: 4, color: "#bbb", marginTop: 8 }}>✦ ✦ ✦</div>
              </div>

              {/* Secciones */}
              {secciones.map(sec => (
                <div key={sec.id} style={{ marginBottom: 20 }}>
                  <h3
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => updateSeccionNombre(sec.id, e.currentTarget.textContent || sec.nombre)}
                    style={{ fontSize: 10, letterSpacing: 3, color: "#8b4513", textAlign: "center", margin: "0 0 10px", fontWeight: 600, outline: "none", cursor: "text" }}
                  >{sec.nombre}</h3>

                  {sec.platillos.map((p, pi) => (
                    <div key={pi} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5, padding: "2px 0", borderBottom: "1px dotted #ddd" }}>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={e => updatePlatillo(sec.id, pi, "nombre", e.currentTarget.textContent || p.nombre)}
                        onClick={e => { e.stopPropagation(); setSelectedId(`${sec.id}-${pi}-n`); }}
                        onContextMenu={e => { e.preventDefault(); e.stopPropagation(); setCtxMenu({ x: e.clientX, y: e.clientY, secId: sec.id, platIdx: pi }); }}
                        style={{
                          fontSize: 12, color: "#2c1810", cursor: "text", flex: 1,
                          outline: selectedId === `${sec.id}-${pi}-n` ? "1.5px solid #a855f7" : "none",
                          borderRadius: 3, padding: "1px 3px",
                        }}
                      >{p.nombre}</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={e => updatePlatillo(sec.id, pi, "precio", e.currentTarget.textContent || p.precio)}
                        onClick={e => { e.stopPropagation(); setSelectedId(`${sec.id}-${pi}-p`); }}
                        style={{
                          fontSize: 12, color: "#8b4513", fontWeight: 600, cursor: "text", marginLeft: 8,
                          outline: selectedId === `${sec.id}-${pi}-p` ? "1.5px solid #a855f7" : "none",
                          borderRadius: 3, padding: "1px 3px",
                        }}
                      >{p.precio}</span>
                    </div>
                  ))}

                  <button
                    onClick={e => { e.stopPropagation(); addPlatillo(sec.id); }}
                    style={{ background: "transparent", border: "1px dashed #ccc", borderRadius: 5, color: "#bbb", fontSize: 10, padding: "4px 10px", cursor: "pointer", width: "100%", marginTop: 4 }}
                  >+ Platillo</button>
                </div>
              ))}

              <button
                onClick={e => { e.stopPropagation(); addSeccion(); }}
                style={{ width: "100%", padding: 8, background: "transparent", border: "1px dashed #ccc", borderRadius: 7, color: "#bbb", fontSize: 11, cursor: "pointer", marginTop: 8 }}
              >+ Agregar sección</button>
            </div>
          </div>
        </div>

        {/* Bottombar */}
        <div style={{ height: 38, background: "#16161d", borderTop: "1px solid #222230", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", flexShrink: 0 }}>
          <span style={{ color: "#555", fontSize: 11 }}>Doble clic para editar · Clic derecho para opciones</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setZoom(z => Math.max(0.3, +(z - 0.1).toFixed(1)))} style={{ width: 26, height: 26, background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 5, color: "#aaa", cursor: "pointer", fontSize: 14 }}>−</button>
            <span style={{ color: "#555", fontSize: 11, minWidth: 36, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(2, +(z + 0.1).toFixed(1)))} style={{ width: 26, height: 26, background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 5, color: "#aaa", cursor: "pointer", fontSize: 14 }}>+</button>
            <button onClick={() => setZoom(0.88)} style={{ width: 26, height: 26, background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 5, color: "#aaa", cursor: "pointer", fontSize: 11 }}>⊙</button>
          </div>
        </div>
      </div>

      {/* ─── Sidebar derecho ─── */}
      <aside style={{ width: 210, background: "#16161d", borderLeft: "1px solid #222230", padding: 14, display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>

        {/* Color */}
        <div>
          <div style={{ color: "#555", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, marginBottom: 8 }}>COLOR DE TEXTO</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {COLORS.map(c => (
              <div key={c} onClick={() => setActiveColor(c)} style={{
                width: 22, height: 22, borderRadius: 5, background: c, cursor: "pointer",
                border: `2px solid ${activeColor === c ? "#a855f7" : c === "#ffffff" ? "#444" : "#2a2a35"}`,
                transition: "transform .1s",
              }} />
            ))}
          </div>
        </div>

        {/* Fondo */}
        <div>
          <div style={{ color: "#555", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, marginBottom: 8 }}>FONDO DEL MENÚ</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {BACKGROUNDS.map(bg => (
              <div key={bg} onClick={() => setActiveBg(bg)} style={{
                width: 32, height: 32, borderRadius: 5, background: bg, cursor: "pointer",
                border: `2px solid ${activeBg === bg ? "#a855f7" : "#2a2a35"}`,
              }} />
            ))}
          </div>
        </div>

        {/* Capas */}
        <div>
          <div style={{ color: "#555", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, marginBottom: 8 }}>CAPAS</div>
          {[
            { label: "T Título",    id: "title" },
            { label: "T Subtítulo", id: "sub" },
            ...secciones.map(s => ({ label: `☰ ${s.nombre}`, id: String(s.id) })),
          ].map(item => (
            <div key={item.id} onClick={() => setSelectedId(item.id)} style={{
              display: "flex", alignItems: "center", gap: 7, padding: "5px 7px", borderRadius: 6,
              color: selectedId === item.id ? "white" : "#777", fontSize: 11, cursor: "pointer",
              background: selectedId === item.id ? "#2a2a35" : "transparent",
            }}>
              <span style={{ fontSize: 10 }}>▶</span>{item.label}
            </div>
          ))}
        </div>

        {/* Tip */}
        <div style={{ background: "#7c3aed18", border: "1px solid #7c3aed33", borderRadius: 8, padding: 10 }}>
          <div style={{ color: "#a855f7", fontSize: 10, fontWeight: 600, marginBottom: 4 }}>💡 Tips rápidos</div>
          <div style={{ color: "#777", fontSize: 10, lineHeight: 1.6 }}>
            · Clic = seleccionar<br />
            · Doble clic = editar<br />
            · Ctrl+Scroll = zoom<br />
            · Clic derecho = opciones
          </div>
        </div>
      </aside>

      {/* ─── Menú contextual ─── */}
      {ctxMenu && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: "fixed", left: ctxMenu.x, top: ctxMenu.y,
            background: "#16161d", border: "1px solid #2a2a35", borderRadius: 8,
            padding: 4, zIndex: 1000, minWidth: 150,
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          {[
            { label: "📋 Duplicar", action: () => { duplicatePlatillo(ctxMenu.secId, ctxMenu.platIdx); setCtxMenu(null); } },
            { label: "⬆ Subir",    action: () => { movePlatillo(ctxMenu.secId, ctxMenu.platIdx, -1); setCtxMenu(null); } },
            { label: "⬇ Bajar",    action: () => { movePlatillo(ctxMenu.secId, ctxMenu.platIdx, 1); setCtxMenu(null); } },
          ].map(item => (
            <div key={item.label} onClick={item.action} style={{ padding: "7px 12px", color: "#bbb", fontSize: 12, borderRadius: 5, cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#2a2a35")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >{item.label}</div>
          ))}
          <div style={{ height: 1, background: "#2a2a35", margin: "3px 0" }} />
          <div onClick={() => { deletePlatillo(ctxMenu.secId, ctxMenu.platIdx); setCtxMenu(null); }}
            style={{ padding: "7px 12px", color: "#f87171", fontSize: 12, borderRadius: 5, cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#f8717120")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >🗑 Eliminar</div>
        </div>
      )}

      {/* ─── Notificación flotante ─── */}
      {notify && (
        <div style={{
          position: "fixed", top: 70, right: 20,
          background: notify.includes("❌") ? "#dc2626" : "#16a34a",
          color: "white", padding: "10px 16px", borderRadius: 8,
          fontSize: 12, fontWeight: 600, zIndex: 9999,
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}>{notify}</div>
      )}
    </div>
  );
}