// utils/fetchWithFallback.js

const IPs = [
  "http://104.155.172.7",
  "http://35.188.93.205",
  "http://34.121.103.70",
];

/**
 * Intenta hacer fetch en las IPs hasta que una responda con éxito.
 * @param {string} endpoint - el path del endpoint (ej. "/cripto/update")
 * @returns {Promise<Response>} - la respuesta de fetch exitosa
 */
export const resilientFetch = async (endpoint) => {
  for (let i = 0; i < IPs.length; i++) {
    const url = `${IPs[i]}${endpoint}`;
    try {
      const res = await fetch(url);
      if (res.ok) return res;
    } catch (e) {
      // Continúa al siguiente host
    }
  }
  throw new Error("No se pudo acceder al endpoint en ninguna IP disponible.");
};
