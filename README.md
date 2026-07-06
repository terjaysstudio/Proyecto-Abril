# SignoEdu — Guía del Código: Imágenes, Preguntas y Respuestas

Esta guía explica **línea por línea** cómo fluye la información de las imágenes, preguntas y respuestas del quiz desde la base de datos hasta la pantalla del usuario.

---

## 🗄️ 1. La Base de Datos (Cloud Firestore)

Todo vive en Firebase Firestore en la colección `senias`. Cada documento representa una letra y almacena estos campos:

```
senias/
  A → { letra: "A", imagenUrl: "data:image/png;base64,...", opciones: ["C","A","X","M"], respuestaCorrecta: "A", tipo: "Adivina la señal" }
  B → { ... }
  ...
  Z → { ... }
```

| Campo | Ejemplo | Descripción |
|---|---|---|
| `letra` | `"A"` | La letra del abecedario |
| `imagenUrl` | `"data:image/png;base64,..."` | La foto de la seña en formato texto (Base64) |
| `opciones` | `["C","A","X","M"]` | Las 4 opciones para elegir en el quiz |
| `respuestaCorrecta` | `"A"` | La letra que corresponde a la imagen |
| `tipo` | `"Adivina la señal"` | El título que aparece en pantalla |

---

## 🔧 2. El Script que Sube los Datos a Firestore

**Archivo:** `scripts/upload-senias.js`  
**Cómo ejecutarlo:** `node scripts/upload-senias.js`

Este script se corre **una sola vez desde la terminal** para popular la base de datos.

```javascript
// ── Paso 1: Conectar con Firebase ─────────────────────────────────────────
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBGQ4UB-...",   // ← credenciales del proyecto
  projectId: "signoedu-dabaf",
  // ...
};

const app = initializeApp(firebaseConfig);  // inicializa la conexión
const db = getFirestore(app);               // obtiene la instancia de Firestore


// ── Paso 2: Función que genera 4 opciones para cada letra ─────────────────
function generarOpciones(correcta, todas) {
  const opciones = [correcta];           // siempre incluye la respuesta correcta
  while (opciones.length < 4) {
    const randomLetra = todas[Math.floor(Math.random() * todas.length)];
    if (!opciones.includes(randomLetra)) {
      opciones.push(randomLetra);        // agrega letras distintas hasta tener 4
    }
  }
  // Mezcla el orden para que la respuesta no siempre sea la primera
  for (let i = opciones.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
  }
  return opciones; // ej: ["C","A","X","M"]
}


// ── Paso 3: Sube los datos a Firestore ────────────────────────────────────
async function updateQuizData() {
  for (const letra of abecedario) {          // recorre A, B, C ... Z
    const opciones = generarOpciones(letra, abecedario);

    const docRef = doc(db, 'senias', letra); // apunta al documento "senias/A", "senias/B"...
    await setDoc(docRef, {
      opciones: opciones,                    // guarda las 4 opciones
      respuestaCorrecta: letra,              // guarda la respuesta correcta
      tipo: 'Adivina la señal'               // guarda el título del quiz
    }, { merge: true });                     // merge:true = NO borra los otros campos (ej: imagenUrl)
  }
}

updateQuizData(); // ← ejecuta todo
```

> ⚠️ `{ merge: true }` es **crucial**: sin él, al actualizar las opciones se borraría la imagen que ya estaba guardada.

---

## 🔌 3. El Servicio que Conecta con la Base de Datos

**Archivo:** `src/app/services/db.service.ts`

Este servicio es el **puente** entre Firebase y las páginas de la app. Las páginas nunca hablan directamente con Firestore — siempre pasan por aquí.

```typescript
// ── Importa las herramientas de Firestore ─────────────────────────────────
import { Firestore, doc, setDoc, getDoc, collection, query, orderBy, getDocs }
  from '@angular/fire/firestore';
//   ↑         ↑       ↑       ↑          ↑        ↑         ↑        ↑
// instancia  crear   guardar  leer un  colección ordenar  traer todos
//            ref     doc      doc        ref      query    los docs


// ── Método principal: pide todas las señas a Firestore ────────────────────
async obtenerSenias() {
  // 1. Apunta a la colección "senias"
  const colRef = collection(this.firestore, 'senias');

  // 2. Crea una consulta ordenada alfabéticamente por el campo "letra"
  const q = query(colRef, orderBy('letra'));

  // 3. Ejecuta la consulta y espera la respuesta de Firestore
  const querySnapshot = await getDocs(q);

  // 4. Convierte cada documento en un objeto JavaScript
  const list = querySnapshot.docs.map(doc => doc.data());
  //                                  ↑         ↑
  //                               cada doc   sus datos como objeto

  // 5. Si recibe menos de 26 señas (algo falló), usa el plan B local
  if (list.length < 26) {
    return this.obtenerSeniasLocalFallback();
  }

  return list; // ← devuelve el arreglo de señas con imagen, opciones, etc.
}


// ── Plan B: si Firestore falla, genera datos localmente ───────────────────
private obtenerSeniasLocalFallback() {
  const todas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  return todas.map(letra => {
    // Genera opciones aleatorias para cada letra
    const opciones = [letra];
    while (opciones.length < 4) {
      const r = todas[Math.floor(Math.random() * todas.length)];
      if (!opciones.includes(r)) opciones.push(r);
    }
    // Devuelve la seña con imagen local como URL (no Base64)
    return {
      letra,
      imagenUrl: `assets/images/${letra}.png`, // ← usa la imagen del dispositivo
      opciones,
      respuestaCorrecta: letra,
      tipo: 'Adivina la señal'
    };
  });
}


// ── Guarda el puntaje del usuario al terminar el quiz ─────────────────────
async guardarPuntaje(nombre: string, puntos: number) {
  const docRef = doc(this.firestore, 'usuarios', nombre); // apunta a "usuarios/Eric"
  await setDoc(docRef, { puntajeTotal: puntos }, { merge: true }); // guarda sin borrar otros campos
}
```

---

## 🎮 4. La Página del Juego (Lección / Quiz)

**Archivo:** `src/app/pages/leccion/leccion.page.ts`

```typescript
export class LeccionPage implements OnInit {
  senias: Senia[] = [];       // arreglo con las 10 preguntas del quiz
  seniaActual!: Senia;        // la pregunta que se muestra en este momento
  indiceActual: number = 0;   // contador: ¿en qué pregunta vamos?
  puntos: number = 0;         // puntaje acumulado del usuario


  // ── Al cargar la página, llama a la función que trae las señas ──────────
  async ngOnInit() {
    await this.cargarYGenerarLeccion();
  }


  // ── Trae las señas de Firestore y arma las 10 preguntas ─────────────────
  async cargarYGenerarLeccion() {
    // 1. Pide todas las señas al servicio (que a su vez las trae de Firestore)
    const dbSenias = await this.dbService.obtenerSenias();

    // 2. Mezcla las 26 señas y toma solo 10 al azar
    const seniasSeleccionadas = this.shuffleArray([...dbSenias]).slice(0, 10);

    // 3. Construye el arreglo de preguntas usando los datos de Firestore
    this.senias = seniasSeleccionadas.map((seniaDb, index) => ({
      id: index + 1,
      imagenUrl: seniaDb.imagenUrl,              // ← imagen Base64 de Firestore
      opciones: seniaDb.opciones,                // ← ["C","A","X","M"] de Firestore
      respuestaCorrecta: seniaDb.respuestaCorrecta, // ← "A" de Firestore
      tipo: seniaDb.tipo                         // ← "Adivina la señal" de Firestore
    }));

    // 4. Muestra la primera pregunta
    this.seniaActual = this.senias[0];
  }


  // ── Se ejecuta cuando el usuario toca una opción ─────────────────────────
  async revisarRespuesta(opcion: string) {
    // Compara lo que eligió el usuario con la respuesta de Firestore
    if (opcion === this.seniaActual.respuestaCorrecta) {
      this.puntos = this.puntos + 10;           // ✅ suma 10 puntos
      await this.mostrarToast('¡Correcto!', 'success');
    } else {
      await this.mostrarToast('Incorrecto', 'danger'); // ❌ no suma
    }

    this.indiceActual++; // avanza a la siguiente pregunta

    if (this.indiceActual < this.senias.length) {
      this.seniaActual = this.senias[this.indiceActual]; // muestra la siguiente
    } else {
      // Ya no hay más preguntas → guarda el puntaje y navega a resultados
      const nombre = this.authService.obtenerNombre();
      this.dbService.guardarPuntaje(nombre, this.puntos); // guarda en Firestore
      this.navCtrl.navigateForward(['/resultados', { puntaje: this.puntos }]);
    }
  }
}
```

---

## 🖥️ 5. La Vista del Quiz (HTML)

**Archivo:** `src/app/pages/leccion/leccion.page.html`

```html
<!-- Solo se muestra cuando seniaActual tiene datos -->
<div *ngIf="seniaActual">

  <!-- ① Título del quiz — viene del campo "tipo" en Firestore -->
  <h3>{{ seniaActual.tipo }}</h3>
  <!-- Muestra: "Adivina la señal" -->

  <p>¿Qué letra representa esta imagen?</p>

  <!-- ② La imagen de la seña — viene del campo "imagenUrl" en Firestore (Base64) -->
  <app-tarjeta-senia [imagenUrl]="seniaActual.imagenUrl">
  </app-tarjeta-senia>
  <!-- El componente recibe la cadena Base64 y la muestra como <img src="data:image/png;base64,..."> -->

  <!-- ③ Las 4 opciones — vienen del campo "opciones[]" en Firestore -->
  <app-boton-opcion
    *ngFor="let opcion of seniaActual.opciones"
    [textoOpcion]="opcion"
    (opcionElegida)="revisarRespuesta($event)">
  </app-boton-opcion>
  <!--
    *ngFor crea UN botón por cada opción:
      [textoOpcion] → muestra la letra en el botón (ej: "A")
      (opcionElegida) → cuando el usuario lo toca, llama a revisarRespuesta("A")
  -->

</div>
```

---

## 📖 6. El Diccionario

**Archivo:** `src/app/pages/diccionario/diccionario.page.ts`

```typescript
async ngOnInit() {
  // Exactamente el mismo método que usa el quiz.
  // Devuelve las 26 señas de Firestore ordenadas de A a Z.
  this.letras = await this.dbService.obtenerSenias();
}
```

```html
<!-- En el HTML, muestra cada seña en una cuadrícula -->
<ion-col *ngFor="let item of letras">
  <!-- La imagen viene de Firestore como Base64 -->
  <img [src]="item.imagenUrl" />
  <!-- La letra del abecedario -->
  <ion-card-title>{{ item.letra }}</ion-card-title>
</ion-col>
```

---

## 🗺️ Flujo Completo de los Datos

```
[Firestore - colección "senias"]
      │
      │  getDocs(query(colRef, orderBy('letra')))
      ▼
[db.service.ts → obtenerSenias()]
      │
      │  await this.dbService.obtenerSenias()
      ├──────────────────────────────────────────────────────────────┐
      ▼                                                              ▼
[leccion.page.ts]                                        [diccionario.page.ts]
cargarYGenerarLeccion()                                  ngOnInit()
  → mezcla 26 señas                                        → muestra las 26 en grilla
  → toma 10 al azar
  → arma preguntas
      │
      ▼
[leccion.page.html]
  {{ seniaActual.tipo }}           ← título del quiz
  [imagenUrl]="..."                ← imagen Base64
  *ngFor opciones[]                ← 4 botones
  revisarRespuesta($event)         ← califica la respuesta
      │
      ▼ (al terminar las 10 preguntas)
[db.service.ts → guardarPuntaje()]
  → guarda en Firestore: usuarios/<nombre> { puntajeTotal: 80 }
```

---

## 📁 Archivos Clave

| Archivo | Rol |
|---|---|
| `scripts/upload-senias.js` | Sube imágenes, opciones y respuestas a Firestore (se corre una vez) |
| `src/app/services/db.service.ts` | Puente entre Firestore y la app |
| `src/app/interfaces/models.ts` | Define la estructura del objeto `Senia` |
| `src/app/pages/leccion/leccion.page.ts` | Lógica del quiz: carga, califica y guarda puntaje |
| `src/app/pages/leccion/leccion.page.html` | Vista del quiz (imagen + opciones) |
| `src/app/pages/diccionario/diccionario.page.ts` | Muestra todas las señas A-Z desde Firestore |
