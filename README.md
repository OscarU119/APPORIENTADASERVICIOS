# RutaLista — Aplicación orientada a servicios

Cotizador académico de envíos. La interfaz consume dos servicios HTTP que devuelven JSON:

| Ruta | Función |
| --- | --- |
| `GET /api/catalogo` | Lista zonas y plazos estimados. |
| `GET /api/cotizaciones?zone=regional&weight=2&priority=false` | Valida datos y devuelve desglose, total y plazo. |

## Ejecutar en Windows o macOS/Linux

Requiere Node.js 20.9 o superior.

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. Para verificar el ejemplo, selecciona **Región centro**, **2 kg** y desactiva la prioridad: el total debe ser **$113.00 MXN**. El sitio publicado está en https://envios-oscar-servicios.rakzour119.chatgpt.site.

## Alcance

Las tarifas son demostrativas. La aplicación no registra envíos, cuentas ni pagos. Los servicios comparten un despliegue; no son microservicios independientes.
