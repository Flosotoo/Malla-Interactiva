const ramosPorSemestre = {
  "1er Año - Semestre I": [
    { nombre: "Fundamentos de programación", abre: ["Desarrollo orientado a objetos"] },
    { nombre: "Introducción al Cloud Computing" },
    { nombre: "Bases de innovación", abre: ["Ingeniería de requisitos"] },
    { nombre: "Nivelación matemática", abre: ["Matemática aplicada"] },
    { nombre: "Habilidades de comunicación" }
  ],
  "1er Año - Semestre II": [
    { nombre: "Desarrollo orientado a objetos", requisitos: ["Fundamentos de programación"], abre: ["Desarrollo fullstack I", "Desarrollo de aplicaciones móviles", "Desarrollo fullstack II"] },
    { nombre: "Base de datos aplicada I", abre: ["Base de datos aplicada II"] },
    { nombre: "Ingeniería de requisitos", requisitos: ["Bases de innovación"], abre: ["Ingeniería de software"] },
    { nombre: "Matemática aplicada", requisitos: ["Nivelación matemática"], abre: ["Estadística descriptiva"] },
    { nombre: "Inglés elemental I", abre: ["Inglés elemental II"] },
    { nombre: "Fundamentos de antropología", abre: ["Ética para el trabajo"] }
  ],
  "2do Año - Semestre I": [
    { nombre: "Desarrollo fullstack I", requisitos: ["Desarrollo orientado a objetos"], abre: ["Desarrollo fullstack II"] },
    { nombre: "Base de datos aplicada II", requisitos: ["Base de datos aplicada I"], abre: ["Taller de base de datos"] },
    { nombre: "Ingeniería de software", requisitos: ["Ingeniería de requisitos"] },
    { nombre: "Inglés elemental II", requisitos: ["Inglés elemental I"], abre: ["Inglés intermedio I"] }
  ],
  "2do Año - Semestre II": [
    { nombre: "Desarrollo fullstack II", requisitos: ["Desarrollo fullstack I", "Desarrollo orientado a objetos"], abre: ["Desarrollo fullstack III"] },
    { nombre: "Desarrollo de aplicaciones móviles", requisitos: ["Desarrollo orientado a objetos"] },
    { nombre: "Taller de base de datos", requisitos: ["Base de datos aplicada II"] },
    { nombre: "Estadística descriptiva", requisitos: ["Matemática aplicada"] },
    { nombre: "Inglés intermedio I", requisitos: ["Inglés elemental II"] },
    { nombre: "Ética para el trabajo", requisitos: ["Fundamentos de antropología"], abre: ["Ética profesional"] }
  ],
  "3er Año - Semestre I": [
    { nombre: "Desarrollo fullstack III", requisitos: ["Desarrollo fullstack II"], abre: ["Seguridad y calidad en el desarrollo de software"] },
    { nombre: "Introducción a herramientas DevOps" },
    { nombre: "Evaluación de proyectos de software", abre: ["Gestión de proyectos de software"] }
  ],
  "3er Año - Semestre II": [
    { nombre: "Desarrollo Cloud Native I", abre: ["Desarrollo Cloud Native II"] },
    { nombre: "Seguridad y calidad en el desarrollo de software", requisitos: ["Desarrollo fullstack III"] },
    { nombre: "Gestión de proyectos de software", requisitos: ["Evaluación de proyectos de software"] }
  ],
  "4to Año - Semestre I": [
    { nombre: "Desarrollo Cloud Native II", requisitos: ["Desarrollo Cloud Native I"], abre: ["Taller aplicado de software"] },
    { nombre: "Arquitecturas TI contemporáneas", abre: ["Taller de tecnologías de vanguardia"] },
    { nombre: "BPM aplicado" },
    { nombre: "Ética profesional", requisitos: ["Ética para el trabajo"] }
  ],
  "4to Año - Semestre II": [
    { nombre: "Taller de tecnologías de vanguardia", requisitos: ["Arquitecturas TI contemporáneas"] },
    { nombre: "Taller aplicado de software", requisitos: ["Desarrollo Cloud Native II"] },
    { nombre: "Práctica profesional", requisitos: ["DEL SEMESTRE 1 al 7 aprobados"] }
  ]
};

let aprobados = new Set();
const mallaContainer = document.getElementById("malla-container");

function actualizarProgreso() {
  const total = Object.values(ramosPorSemestre).flat().length;
  const completados = aprobados.size;
  const porcentaje = Math.round((completados / total) * 100);
  document.getElementById("progreso").style.width = `${porcentaje}%`;
  document.getElementById("progreso-text").textContent = `${porcentaje}% Completado`;
}

function puedeDesbloquear(ramo) {
  if (!ramo.requisitos) return true;
  return ramo.requisitos.every(r => aprobados.has(r) || r.includes("DEL SEMESTRE") || aprobados.has("DEL SEMESTRE 1 al 7 aprobados"));
}

function crearRamoElemento(ramo) {
  const div = document.createElement("div");
  div.className = "ramo bloqueado";
  div.textContent = ramo.nombre;

  div.addEventListener("click", () => {
    if (!puedeDesbloquear(ramo)) return;

    const nota = prompt(`Ingresa la nota final de "${ramo.nombre}":`, "4.0");
    const notaNum = parseFloat(nota);
    if (isNaN(notaNum) || notaNum < 1.0 || notaNum > 7.0) return alert("Nota inválida.");

    div.classList.remove("bloqueado");
    div.classList.add("aprobado");
    if (notaNum >= 6.0) {
      div.classList.add("califica");
    }

    const notaSpan = document.createElement("div");
    notaSpan.className = "nota";
    notaSpan.textContent = `Nota: ${notaNum}`;
    div.appendChild(notaSpan);

    aprobados.add(ramo.nombre);
    desbloquearTodos();
    actualizarProgreso();
  });

  return div;
}

function desbloquearTodos() {
  document.querySelectorAll(".ramo").forEach(el => {
    el.classList.contains("bloqueado") && el.classList.remove("bloqueado");
  });
}

for (const [seccion, listaRamos] of Object.entries(ramosPorSemestre)) {
  const seccionDiv = document.createElement("div");
  seccionDiv.className = "seccion";

  const h2 = document.createElement("h2");
  h2.textContent = seccion;
  seccionDiv.appendChild(h2);

  const semestreDiv = document.createElement("div");
  semestreDiv.className = "semestre";

  listaRamos.forEach(ramo => {
    const el = crearRamoElemento(ramo);
    semestreDiv.appendChild(el);
  });

  seccionDiv.appendChild(semestreDiv);
  mallaContainer.appendChild(seccionDiv);
}

actualizarProgreso();
