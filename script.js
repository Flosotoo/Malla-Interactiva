const ramos = [
  // === Primer Año ===
  { nombre: "Fundamentos de programación", requisitos: [], abre: ["Desarrollo orientado a objetos"] },
  { nombre: "Introducción al Cloud Computing", requisitos: [], abre: [] },
  { nombre: "Bases de innovación", requisitos: [], abre: ["Ingeniería de requisitos"] },
  { nombre: "Nivelación matemática", requisitos: [], abre: ["Matemática aplicada"] },
  { nombre: "Habilidades de comunicación", requisitos: [], abre: [] },
  { nombre: "Desarrollo orientado a objetos", requisitos: ["Fundamentos de programación"], abre: ["Desarrollo fullstack I", "Desarrollo de aplicaciones móviles", "Desarrollo fullstack II"] },
  { nombre: "Base de datos aplicada I", requisitos: [], abre: ["Base de datos aplicada II"] },
  { nombre: "Ingeniería de requisitos", requisitos: ["Bases de innovación"], abre: ["Ingeniería de software"] },
  { nombre: "Matemática aplicada", requisitos: ["Nivelación matemática"], abre: ["Estadística descriptiva"] },
  { nombre: "Inglés elemental I", requisitos: [], abre: ["Inglés elemental II"] },
  { nombre: "Fundamentos de antropología", requisitos: [], abre: ["Ética para el trabajo"] },
  { nombre: "Desarrollo fullstack I", requisitos: ["Desarrollo orientado a objetos"], abre: ["Desarrollo fullstack II"] },
  { nombre: "Base de datos aplicada II", requisitos: ["Base de datos aplicada I"], abre: ["Taller de base de datos"] },
  { nombre: "Ingeniería de software", requisitos: ["Ingeniería de requisitos"], abre: [] },
  { nombre: "Inglés elemental II", requisitos: ["Inglés elemental I"], abre: ["Inglés intermedio I"] },
  { nombre: "Desarrollo fullstack II", requisitos: ["Desarrollo fullstack I", "Desarrollo orientado a objetos"], abre: ["Desarrollo fullstack III"] },
  { nombre: "Desarrollo de aplicaciones móviles", requisitos: ["Desarrollo orientado a objetos"], abre: [] },
  { nombre: "Taller de base de datos", requisitos: ["Base de datos aplicada II"], abre: [] },
  { nombre: "Estadística descriptiva", requisitos: ["Matemática aplicada"], abre: [] },
  { nombre: "Inglés intermedio I", requisitos: ["Inglés elemental II"], abre: [] },
  { nombre: "Ética para el trabajo", requisitos: ["Fundamentos de antropología"], abre: ["Ética profesional"] },
  { nombre: "Desarrollo fullstack III", requisitos: ["Desarrollo fullstack II"], abre: ["Seguridad y calidad en el desarrollo de software"] },
  { nombre: "Introducción a herramientas DevOps", requisitos: [], abre: [] },
  { nombre: "Evaluación de proyectos de software", requisitos: [], abre: ["Gestión de proyectos de software"] },
  { nombre: "Desarrollo Cloud Native I", requisitos: [], abre: ["Desarrollo Cloud Native II"] },
  { nombre: "Seguridad y calidad en el desarrollo de software", requisitos: ["Desarrollo fullstack III"], abre: [] },
  { nombre: "Gestión de proyectos de software", requisitos: ["Evaluación de proyectos de software"], abre: [] },
  { nombre: "Desarrollo Cloud Native II", requisitos: ["Desarrollo Cloud Native I"], abre: ["Taller aplicado de software"] },
  { nombre: "Arquitecturas TI contemporáneas", requisitos: [], abre: ["Taller de tecnologías de vanguardia"] },
  { nombre: "BPM aplicado", requisitos: [], abre: [] },
  { nombre: "Ética profesional", requisitos: ["Ética para el trabajo"], abre: [] },
  { nombre: "Taller de tecnologías de vanguardia", requisitos: ["Arquitecturas TI contemporáneas"], abre: [] },
  { nombre: "Taller aplicado de software", requisitos: ["Desarrollo Cloud Native II"], abre: [] },
  { nombre: "Práctica profesional", requisitos: ["DEL SEMESTRE 1 al 7 aprobados"], abre: [] },
];

let aprobados = new Set();

const container = document.getElementById("malla-container");

function actualizarProgreso() {
  const total = ramos.length;
  const completados = aprobados.size;
  const porcentaje = Math.round((completados / total) * 100);
  document.getElementById("progreso").style.width = porcentaje + "%";
  document.getElementById("progreso-text").textContent = `${porcentaje}% Completado`;
}

function crearRamo(ramo, index) {
  const div = document.createElement("div");
  div.className = "ramo bloqueado";
  div.id = "ramo-" + index;
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
    desbloquearRamos();
    actualizarProgreso();
  });

  return div;
}

function puedeDesbloquear(ramo) {
  return ramo.requisitos.every(req => aprobados.has(req) || req.includes("DEL SEMESTRE") || aprobados.has("DEL SEMESTRE 1 al 7 aprobados"));
}

function desbloquearRamos() {
  ramos.forEach((ramo, index) => {
    const div = document.getElementById("ramo-" + index);
    if (puedeDesbloquear(ramo)) {
      div.classList.remove("bloqueado");
    }
  });
}

ramos.forEach((ramo, index) => {
  const div = crearRamo(ramo, index);
  container.appendChild(div);
});

actualizarProgreso();
