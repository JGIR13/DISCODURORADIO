# Disco Duro Radio — Mockup UI/UX

Mockup ejecutable en navegador basado en el documento de requerimientos
del cliente ("Disco Duro Radio — Documento de requerimientos para
prototipado y diseño web UI/UX"). Fase actual: **solo frontend**, sin
backend ni streaming real (usa datos y textos de ejemplo).

## Estructura

```
DiscoDuroRadio/
├── backend/                  <- vacio por ahora (fase futura)
├── .github/workflows/pages.yml <- despliegue automatico a GitHub Pages
├── frontend/
│   ├── index.html            <- pagina principal (ruta base)
│   ├── css/
│   │   └── style.css         <- estilos (retro-industrial / archivo de datos)
│   ├── js/
│   │   └── main.js           <- i18n, contenido dinamico, player mock
│   ├── 404.html, robots.txt, sitemap.xml, manifest.webmanifest, .nojekyll
│   ├── img/                  <- favicon, iconos, og-image y futuras imagenes
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

## Publicar en GitHub Pages

El sitio es 100% estatico y todas las rutas son relativas, por lo que
funciona tambien bajo `https://<usuario>.github.io/<repo>/`.
El workflow `.github/workflows/pages.yml` publica solo la carpeta
`frontend/` cada vez que se hace push a `master` o `main`.

1. En GitHub: **Settings > Pages > Build and deployment > Source: GitHub Actions**.
2. Haz push de los cambios (ver comandos abajo).
3. En la pestana **Actions** espera a que termine "Deploy a GitHub Pages".
4. El sitio quedara en la URL que muestra Settings > Pages
   (esperada: `https://jgir13.github.io/DISCODURORADIO/`).

Si cambias el nombre del repo o usas dominio propio, actualiza las URL
absolutas (canonical, `og:url`, `og:image`, `twitter:image`) en
`frontend/index.html`, `robots.txt` y `sitemap.xml`.

```
git add .
git commit -m "Configurar despliegue en GitHub Pages"
git push origin master
```

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
