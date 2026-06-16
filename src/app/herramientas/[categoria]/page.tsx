import { productosPorCategoria } from "@/lib/productos-afiliados";
import Link from "next/link";
import Image from "next/image";

const nombreCategoria: Record<string, string> = {
  plomeria: "Plomería",
  electricidad: "Electricidad",
  carpinteria: "Carpintería",
  pintura: "Pintura",
  humedad: "Humedad",
  electrodomesticos: "Electrodomésticos",
};

const descripcionProducto: Record<string, string> = {
  "Teflon": "Imprescindible para sellar roscas y evitar pérdidas de agua",
  "Desatascador sopapa": "Destapá piletas y desagotes sin llamar a un plomero",
  "Llave de paso": "Cortá el agua de forma rápida y segura en cualquier momento",
  "Arandelas y gomas": "Reparé canillas que gotean en minutos sin experiencia",
  "Cinta autofusionante": "Sellá cañerías con pérdidas de agua de forma permanente",
  "Llave stillson": "La herramienta clave para ajustar y aflojar caños y accesorios",
  "Silicona selladora": "Sellá juntas, grietas y filtraciones en baños y cocinas",
  "Flexible de conexion": "Conectá canillas e inodoros sin complicaciones",
  "Multimetro tester": "Medí tensión, corriente y resistencia en cualquier circuito",
  "Cinta aisladora": "Protegé empalmes y cables con aislamiento profesional",
  "Llave de luz simple": "Reemplazá llaves dañadas en minutos sin electricista",
  "Tomacorriente": "Instalá o reemplazá tomacorrientes de forma segura",
  "Cable unipolar 2.5mm": "Cable ideal para instalaciones eléctricas domiciliarias",
  "Termica disyuntor": "Protegé tu instalación de sobrecargas y cortocircuitos",
  "Lampara LED": "Ahorrá energía con iluminación LED de larga duración",
  "Pinza amperometrica": "Medí el consumo eléctrico sin cortar el circuito",
  "Bisagras": "Reparé puertas y muebles con bisagras resistentes",
  "Lija al agua": "Lijá madera y paredes para un acabado perfecto",
  "Sellador para madera": "Protegé y embellecé superficies de madera",
  "Clavos y tornillos": "Kit completo para todo tipo de trabajo en madera",
  "Cola vinilica": "El pegamento clásico para madera de máxima resistencia",
  "Serrucho": "Cortá madera con precisión y facilidad",
  "Formon escoplo": "Trabajos de precisión en madera como un profesional",
  "Mechas para taladro": "Set completo de mechas para todo tipo de material",
  "Taladro inalambrico": "La herramienta imprescindible para cualquier trabajo en casa",
  "Rodillo de pintura": "Pintá paredes y techos de forma rápida y pareja",
  "Pincel": "Para bordes, esquinas y trabajos de precision",
  "Cinta de enmascarar": "Protege marcos y zocalos mientras pintas",
  "Bandeja para pintura": "Carga el rodillo sin manchas ni desperdicios",
  "Masilla para paredes": "Tapa grietas y agujeros antes de pintar",
  "Lija para pared": "Prepara la superficie para una pintura perfecta",
  "Fijador sellador pared": "Sellá la pared antes de pintar para mejor adherencia",
  "Espatula": "Aplica masilla y raspa superficies con precision",
  "Impermeabilizante techo": "Protege tu techo de filtraciones y goteras de forma duradera",
  "Membrana liquida": "Impermeabiliza terrazas y balcones con una sola mano de producto",
  "Pintura antihumedad": "Elimina manchas de humedad y previene su reaparicion en paredes",
  "Sellador de grietas": "Tapa fisuras y grietas en paredes antes de que avancen",
  "Cinta butilica": "Sella filtraciones en techos y canaletas de forma rapida",
  "Hidrorepelente fachada": "Protege la fachada exterior de la lluvia y la humedad",
  "Deshumidificador": "Reduce la humedad del ambiente y previene el moho",
  "Extractor de ventilacion": "Mejora la ventilacion en banos y cocinas para evitar humedad",
  "Fusible para microondas": "Reemplaza el fusible quemado y devolvele la vida a tu microondas",
  "Correa para lavarropas": "Repara tu lavarropas que no centrifuga cambiando la correa",
  "Filtro para campana": "Mantene tu campana extractora funcionando al maximo",
  "Resistencia termotanque": "Repara tu termotanque sin llamar a un tecnico",
  "Bomba para lavarropas": "Solucioná el problema de desague de tu lavarropas",
  "Termostato para heladera": "Repara tu heladera que no enfria cambiando el termostato",
  "Cautin soldador": "Repara circuitos y conexiones electricas con precision",
  "Cinta teflon termoselladora": "Repara y mantene tu termoselladora como nueva",
};

export default function CategoriaPage({ params }: { params: { categoria: string } }) {
  const { categoria } = params;
  const productos = productosPorCategoria[categoria] ?? [];
  const nombre = nombreCategoria[categoria] ?? categoria;

  return (
    <main style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "32px 20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <Link href="/herramientas" style={{ color: "#F97316", fontSize: "14px", textDecoration: "none", display: "inline-block", marginBottom: "16px" }}>
          ← Volver a categorías
        </Link>

        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ color: "#1E3A5F", fontSize: "1.8rem", margin: "0 0 6px" }}>{nombre}</h1>
          <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
            {productos.length} productos seleccionados · Comprá en MercadoLibre con entrega a todo el país
          </p>
        </div>

        <style>{`.banner-lateral{display:none!important}@media(min-width:1400px){.banner-lateral{display:block!important}}`}</style>

        <div style={{
          position: "fixed",
          left: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          display: "none",
        }} className="banner-lateral">
          <a href="/ebook">
            <img src="/banner-ebook.png" alt="Ebook reparaciones" style={{ width: "220px", borderRadius: "10px", display: "block" }} />
          </a>
        </div>

        <div style={{
          position: "fixed",
          right: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          display: "none",
        }} className="banner-lateral">
          <a href="/profesionales">
            <img src="/banner-profesionales.png" alt="Planes profesionales" style={{ width: "220px", borderRadius: "10px", display: "block" }} />
          </a>
        </div>

        <div>
          {productos.length === 0 ? (
            <p style={{ color: "#999" }}>Próximamente...</p>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "16px",
            }}>
              {productos.map((p, i) => (
                <a key={p.link} href={p.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <div style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    border: "1px solid #e8e8e8",
                  }}>
                    <div style={{ position: "relative", backgroundColor: "#f9f9f9", padding: "20px", display: "flex", justifyContent: "center", alignItems: "center", height: "190px" }}>
                      {i < 3 && (
                        <div style={{ position: "absolute", top: "10px", left: "10px", backgroundColor: "#F97316", color: "white", fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "4px" }}>
                          MAS VENDIDO
                        </div>
                      )}
                      <Image src={p.imagen} alt={p.nombre} width={150} height={150} style={{ objectFit: "contain", maxHeight: "150px" }} />
                    </div>
                    <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                      <p style={{ color: "#1E3A5F", fontSize: "15px", fontWeight: "600", margin: 0 }}>{p.nombre}</p>
                      <p style={{ color: "#666", fontSize: "13px", margin: 0, lineHeight: "1.4" }}>
                        {descripcionProducto[p.nombre] ?? "Producto recomendado para tus reparaciones"}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        {"★★★★★".split("").map((s, j) => (
                          <span key={j} style={{ color: j < 4 ? "#F97316" : "#ddd", fontSize: "16px" }}>{s}</span>
                        ))}
                        <span style={{ color: "#999", fontSize: "12px", marginLeft: "4px" }}>4.0</span>
                      </div>
                      <p style={{ color: "#1E3A5F", fontSize: "1.5rem", fontWeight: "800", margin: "4px 0 0" }}>{p.precio}</p>
                      <div style={{ marginTop: "auto", backgroundColor: "#F97316", color: "white", textAlign: "center", padding: "12px", borderRadius: "8px", fontWeight: "700", fontSize: "15px" }}>
                        Lo quiero
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
