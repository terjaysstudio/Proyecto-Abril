# SignoEdu — Guía del Código: Imágenes, Preguntas y Respuestas

Esta guía explica cómo fluye la información de las **imágenes, preguntas y respuestas** del quiz desde la base de datos hasta la pantalla del usuario.

---

## 🗄️ 1. La Base de Datos (Cloud Firestore)

Todo vive en **Firebase Firestore** en la colección `senias`. Cada documento representa una letra del abecedario (A–Z) y tiene estos campos:

```
senias/
  A → { letra, imagenUrl, opciones, respuestaCorrecta, tipo }
  B → { letra, imagenUrl, opciones, respuestaCorrecta, tipo }
  ...
  Z → { letra, imagenUrl, opciones, respuestaCorrecta, tipo }
```

| Campo | Tipo | Descripción |
|---|---|---|
| `letra` | string | La letra (`"A"`, `"B"`, …) |
| `imagenUrl` | string (Base64) | La foto de la seña codificada en texto |
| `opciones` | string[] | Las 4 opciones del quiz (ej. `["A","C","M","X"]`) |
| `respuestaCorrecta` | string | La letra correcta (ej. `"A"`) |
| `tipo` | string | Título del quiz (ej. `"Adivina la señal"`) |

---

## 🔧 2. El Script que Sube los Datos

**Archivo:** [`scripts/upload-senias.js`](./scripts/upload-senias.js)

Este script se ejecuta **una sola vez desde la terminal** con el comando:
```bash
node scripts/upload-senias.js
```

Lo que hace:
1. Lee las imágenes locales (`A.png` a `Z.png`) y las convierte a Base64.
2. Genera 4 opciones mezcladas para cada letra.
3. Sube todo a Firestore con `setDoc(..., { merge: true })` para no borrar datos existentes.

> ⚠️ Solo necesitas correr este script si quieres actualizar o resetear los datos del quiz en Firestore.

---

## 🔌 3. El Servicio que Conecta con la Base de Datos

**Archivo:** [`src/app/services/db.service.ts`](./src/app/services/db.service.ts)

Este servicio es el **intermediario** entre Firebase y las páginas de la aplicación.

### Método principal: `obtenerSenias()`
```typescript
// Línea 33
async obtenerSenias(): Promise<{ letra, imagenUrl, opciones, respuestaCorrecta, tipo }[]>
```
- Consulta la colección `senias` en Firestore ordenada alfabéticamente.
- Si por algún motivo la base de datos falla o está vacía, **activa el fallback local** para que la app siga funcionando.

### Método de respaldo: `obtenerSeniasLocalFallback()` (privado)
```typescript
// Línea 54
private obtenerSeniasLocalFallback(): { ... }[]
```
- Se activa **solo si Firestore falla** o devuelve menos de 26 señas.
- Genera opciones aleatorias en el cliente como plan B.

### Otros métodos del servicio
| Método | Qué hace |
|---|---|
| `guardarPuntaje(nombre, puntos)` | Guarda el puntaje del usuario en la colección `usuarios` |
| `obtenerPuntaje(nombre)` | Lee el puntaje guardado de un usuario |

---

## 🎮 4. La Página del Juego (Lección / Quiz)

**Archivos:** [`src/app/pages/leccion/leccion.page.ts`](./src/app/pages/leccion/leccion.page.ts) y [`leccion.page.html`](./src/app/pages/leccion/leccion.page.html)

### ¿Cómo carga las preguntas? — `cargarYGenerarLeccion()`
```typescript
// leccion.page.ts — Línea 20
async cargarYGenerarLeccion() {
  const dbSenias = await this.dbService.obtenerSenias(); // ← pide los datos a Firestore
  const seniasSeleccionadas = this.shuffleArray([...dbSenias]).slice(0, 10); // ← selecciona 10 al azar

  this.senias = seniasSeleccionadas.map((seniaDb, index) => ({
    id: index + 1,
    imagenUrl: seniaDb.imagenUrl,         // ← imagen de la seña (de Firestore)
    opciones: seniaDb.opciones,           // ← 4 opciones (de Firestore)
    respuestaCorrecta: seniaDb.respuestaCorrecta, // ← respuesta correcta (de Firestore)
    tipo: seniaDb.tipo                    // ← título del quiz (de Firestore)
  }));
}
```

### ¿Cómo se muestra en pantalla? — `leccion.page.html`
```html
<!-- Título del quiz (viene de Firestore: tipo) -->
<h3>{{ seniaActual.tipo }}</h3>

<!-- Imagen de la seña (viene de Firestore: imagenUrl en Base64) -->
<app-tarjeta-senia [imagenUrl]="seniaActual.imagenUrl"></app-tarjeta-senia>

<!-- Las 4 opciones (vienen de Firestore: opciones[]) -->
<app-boton-opcion
  *ngFor="let opcion of seniaActual.opciones"
  [textoOpcion]="opcion"
  (opcionElegida)="revisarRespuesta($event)">
</app-boton-opcion>
```

### ¿Cómo califica las respuestas? — `revisarRespuesta()`
```typescript
// leccion.page.ts — Línea 78
async revisarRespuesta(opcion: string) {
  if (opcion === this.seniaActual.respuestaCorrecta) {
    this.puntos += 10; // ✅ correcto
  } else {
    // ❌ incorrecto
  }
}
```

---

## 📖 5. El Diccionario

**Archivos:** [`src/app/pages/diccionario/diccionario.page.ts`](./src/app/pages/diccionario/diccionario.page.ts)

Usa el mismo método `obtenerSenias()` para mostrar todas las señas del A al Z en una cuadrícula:

```typescript
async ngOnInit() {
  this.letras = await this.dbService.obtenerSenias(); // ← misma consulta a Firestore
}
```

---

## 🗺️ Mapa Visual del Flujo

```
Firestore (colección "senias")
       │
       │  obtenerSenias()
       ▼
DbService (db.service.ts)
       │
       ├──► LeccionPage (leccion.page.ts)
       │         │  cargarYGenerarLeccion()
       │         ▼
       │    leccion.page.html
       │    ┌─────────────────────────────┐
       │    │ Título:  {{ seniaActual.tipo }}         │
       │    │ Imagen:  [imagenUrl]                    │
       │    │ Opciones: *ngFor opciones[]             │
       │    └─────────────────────────────┘
       │
       └──► DiccionarioPage (diccionario.page.ts)
                 │  ngOnInit()
                 ▼
            diccionario.page.html
            ┌─────────────────────────────┐
            │ Grilla A-Z con imágenes     │
            └─────────────────────────────┘
```

---

## 📁 Archivos Clave Resumidos

| Archivo | Rol |
|---|---|
| `scripts/upload-senias.js` | Sube imágenes, opciones y respuestas a Firestore |
| `src/app/services/db.service.ts` | Conecta con Firestore y expone los datos a la app |
| `src/app/interfaces/models.ts` | Define la estructura de datos de `Senia` |
| `src/app/pages/leccion/leccion.page.ts` | Lógica del quiz: carga, muestra y califica |
| `src/app/pages/leccion/leccion.page.html` | Vista del quiz (imagen + opciones) |
| `src/app/pages/diccionario/diccionario.page.ts` | Muestra todas las señas A-Z desde Firestore |
