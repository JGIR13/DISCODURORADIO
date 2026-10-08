# Disco Duro Radio — Mockup UI/UX

Mockup ejecutable en navegador basado en el documento de requerimientos
del cliente ("Disco Duro Radio — Documento de requerimientos para
prototipado y diseño web UI/UX"). Fase actual: **solo frontend**, sin
backend ni streaming real (usa datos y textos de ejemplo).

## Estructura

```
DiscoDuroRadio/
├── backend/                  <- vacio por ahora (fase futura)
├── frontend/
│   ├── index.html            <- pagina principal (ruta base)
│   ├── css/
│   │   └── style.css         <- estilos (retro-industrial / archivo de datos)
│   ├── js/
│   │   └── main.js           <- i18n, contenido dinamico, player mock
│   ├── img/                  <- imagenes (logo, caratulas, fotos)
│   └── lang/
│       ├── es/es.json        <- textos en espanol
│       └── en/en.json        <- textos en ingles
├── start_frontend.bat        <- levanta el frontend (http://localhost:5173)
├── start_backend.bat         <- placeholder, backend aun no implementado
└── start_all.bat             <- levanta frontend + backend en ventanas separadas
```

## Como ejecutarlo

Doble clic en `start_all.bat` (o `start_frontend.bat` directamente).
Requiere tener Python instalado (usa `python -m http.server`) para
servir el sitio en `http://localhost:5173`; esto evita problemas de
CORS al cargar los JSON de idioma con `fetch`.

Si no tienes Python, tambien puedes abrir `frontend/index.html`
directamente en el navegador, pero el selector de idioma podria no
cargar los archivos JSON en algunos navegadores por restricciones de
`file://`.

## Direccion de arte implementada

- Paleta monocromatica de alto contraste: negro absoluto / gris carbon,
  blanco hueso, con acentos ambar CRT y verde fosforo.
- Tipografia: Archivo Black (titulares de impacto), Space Grotesk
  (UI/subtitulos) e IBM Plex Mono (cuerpo, metadatos, elemento "terminal").
- Cada seccion se presenta como un archivo de sistema
  (`01_MANIFIESTO.TXT`, `02_EDITORIAL.LOG`, etc.), reforzando la idea
  de "archivo de datos clasico" pedida en el brief.
- Reproductor persistente (sticky) fijo en la parte inferior, con
  indicador EN VIVO / ARCHIVO, VU-meter animado y metadatos en tiempo
  real — no se interrumpe al navegar entre secciones.
- Selector de idioma ES/EN en la barra de navegacion y textos servidos
  desde `lang/es` y `lang/en`.

## Pendiente para siguientes fases

- Conectar el Sticky Player a un proveedor real de streaming (Radio.co,
  Zenith, o embebido).
- Backend para gestion de programacion, editorial y archivo (carpeta
  `backend/` ya reservada).
- Imagenes reales (logo, caratulas, fotos de curadores) en `frontend/img`.
