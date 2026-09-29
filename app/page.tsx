"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Box, CheckCircle2, MapPin, PackageCheck, Truck } from "lucide-react";

type Zone = { id: string; name: string; days: string };
type Quote = { total: number; base: number; weightCharge: number; priorityCharge: number; zone: string; days: string; currency: string };

export default function Home() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [zone, setZone] = useState("regional");
  const [weight, setWeight] = useState("2");
  const [priority, setPriority] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/catalogo")
      .then(async r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => setZones(data.zones))
      .catch(() => setError("No se pudo cargar el catálogo. Actualiza la página."));
  }, []);

  async function calculate(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(""); setQuote(null);
    try {
      const params = new URLSearchParams({ zone, weight, priority: String(priority) });
      const response = await fetch(`/api/cotizaciones?${params}`, { headers: { Accept: "application/json" } });
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) throw new Error("El servicio de cotización no respondió correctamente. Actualiza la página e inténtalo de nuevo.");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo calcular la tarifa.");
      setQuote(data);
    } catch (err) { setError(err instanceof Error ? err.message : "Ocurrió un error."); }
    finally { setBusy(false); }
  }

  return <main className="app-shell">
    <header className="topbar"><div className="brand"><span className="brand-icon"><Truck size={23}/></span><span>Ruta<span className="brand-accent">Lista</span></span></div><span className="top-label">COTIZADOR DE ENVÍOS</span></header>
    <div className="workspace">
      <section className="intro"><div className="eyebrow"><span className="eyebrow-dot"/> SERVICIOS DE PAQUETERÍA</div><h1>Calcula tu envío<br/><em>en segundos.</em></h1><p>Elige un destino y el peso de tu paquete. Te mostramos la tarifa desglosada y el tiempo estimado de entrega.</p></section>
      <div className="content-grid">
        <form className="form-card" onSubmit={calculate}>
          <div className="section-head"><span className="step">01</span><div><h2>Datos del paquete</h2><p>Completa los datos para obtener una cotización.</p></div></div>
          <label htmlFor="zone"><MapPin size={17}/> Zona de destino</label>
          <select id="zone" value={zone} onChange={e=>{setZone(e.target.value);setQuote(null)}} disabled={!zones.length}>
            {zones.length ? zones.map(z=><option key={z.id} value={z.id}>{z.name} · {z.days}</option>) : <option>Cargando destinos…</option>}
          </select>
          <label htmlFor="weight"><Box size={17}/> Peso del paquete</label>
          <div className="input-with-unit"><input id="weight" type="number" min="0.1" max="30" step="0.1" required value={weight} onChange={e=>{setWeight(e.target.value);setQuote(null)}}/><span>kg</span></div>
          <label className="priority-row"><span><strong>Entrega prioritaria</strong><small>Reduce el tiempo estimado por una tarifa adicional.</small></span><input type="checkbox" checked={priority} onChange={e=>{setPriority(e.target.checked);setQuote(null)}}/></label>
          <button className="primary-button" disabled={busy || !zones.length}>{busy ? "Calculando…" : "Calcular tarifa"}<ArrowRight size={18}/></button>
          {error && <p className="error" role="alert">{error}</p>}
        </form>
        <section className="result-card" aria-live="polite">
          <div className="section-head"><span className="step light">02</span><div><h2>Tu cotización</h2><p>Tarifa estimada en pesos mexicanos.</p></div></div>
          {quote ? <div className="quote-content"><span className="quote-tag"><CheckCircle2 size={15}/> COTIZACIÓN LISTA</span><div className="total-label">Total estimado</div><div className="total">${quote.total.toFixed(2)} <span>MXN</span></div><div className="quote-divider"/><div className="line"><span>Tarifa base · {quote.zone}</span><strong>${quote.base.toFixed(2)}</strong></div><div className="line"><span>Cargo por peso</span><strong>${quote.weightCharge.toFixed(2)}</strong></div><div className="line"><span>Servicio prioritario</span><strong>${quote.priorityCharge.toFixed(2)}</strong></div><div className="delivery"><Truck size={20}/><span>Entrega estimada <strong>{quote.days}</strong></span></div><p className="footnote">Cotización demostrativa. No se contrata ni registra un envío.</p></div> : <div className="empty-result"><div className="empty-icon"><PackageCheck size={38} strokeWidth={1.5}/></div><h3>Tu tarifa aparecerá aquí</h3><p>Completa los datos del paquete y presiona “Calcular tarifa”.</p></div>}
        </section>
      </div>
      <footer><span>RutaLista · Demostración académica</span><span>Catálogo y cotizaciones mediante servicios HTTP</span></footer>
    </div>
  </main>;
}
