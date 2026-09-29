export const zones = [
  { id: "local", name: "Puebla y zona metropolitana", days: "1 a 2 días", base: 65 },
  { id: "regional", name: "Región centro", days: "2 a 3 días", base: 95 },
  { id: "national", name: "Resto de México", days: "4 a 6 días", base: 145 },
] as const;

export function getQuote(input: unknown) {
  if (!input || typeof input !== "object") throw new Error("Ingresa los datos del envío.");
  const { zone, weight, priority } = input as Record<string, unknown>;
  const selected = zones.find(item => item.id === zone);
  if (!selected) throw new Error("Selecciona una zona válida.");
  if (typeof weight !== "number" || !Number.isFinite(weight) || weight < 0.1 || weight > 30) throw new Error("El peso debe estar entre 0.1 y 30 kg.");
  if (typeof priority !== "boolean") throw new Error("Indica si deseas entrega prioritaria.");
  const base = selected.base;
  const weightCharge = Math.round(Math.max(0, weight - 1) * 18 * 100) / 100;
  const priorityCharge = priority ? 55 : 0;
  return { zone: selected.name, days: priority ? "1 a 2 días" : selected.days, base, weightCharge, priorityCharge, total: Math.round((base + weightCharge + priorityCharge) * 100) / 100, currency: "MXN" };
}
