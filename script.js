const ramos = {
  "fundamentos de programacion": ["desarrollo orientado a objetos"],
  "bases de innovacion": ["ingenieria de requisitos"],
  "nivelacion matematica": ["matematica aplicada"],
  "desarrollo orientado a objetos": ["desarrollo fullstack I", "desarrollo de aplicaciones moviles", "desarrollo fullstack II"],
  "base de datos aplicada I": ["base de datos aplicada II"],
  "ingenieria de requisitos": ["ingenieria de software"],
  "matematica aplicada": ["estadistica descriptiva"],
  "ingles elemental I": ["ingles elemental II"],
  "fundamentis de antropologia": ["etica para el trabajo"],
  "desarrollo fullstack I": ["desarrollo fullstack II"],
  "base de datos aplicada II": ["taller de base de datos"],
  "ingles elemental II": ["ingles intermedio I"],
  "desarrollo fullstack II": ["desarrollo fullstack III"],
  "etica para el trabajo": ["etica profesional"],
  "desarrollo fullstack III": ["seguridad y calidad en el desarrollo de software"],
  "evaluacion de proyectos de software": ["gestion de proyectos de software"],
  "desarrollo cloud native II": ["taller aplicado de software"],
  "arquitecturas TI contemporaneas": ["taller de tecnologias de vanguardia"],
  "practica profesional": [] // requiere todos los anteriores
};

const allRamos = Object.keys(ramos).concat(...Object.values(ramos)).filter((v, i, a) => a.indexOf(v) === i);
const approved = new Set();
const malla = document.getElementById("malla");

function createRamo(name) {
  const div = document.createElement("div");
  div.className = "ramo locked";
  div.textContent = name;
  div.dataset.name = name;
  div.onclick = () => approveRamo(name);
  malla.appendChild(div);
}

function approveRamo(name) {
  const div = document.querySelector(`.ramo[data-name="${name}"]`);
  if (!div || div.classList.contains("locked") || div.classList.contains("approved")) return;

  div.classList.remove("locked");
  div.classList.add("approved");
  approved.add(name);

  // Desbloquear dependientes
  for (const [req, dependents] of Object.entries(ramos)) {
    if (req === name) {
      dependents.forEach(dep => {
        const depDiv = document.querySelector(`.ramo[data-name="${dep}"]`);
        if (depDiv && isUnlocked(dep)) {
          depDiv.classList.remove("locked");
        }
      });
    }
  }

  updateProgress();
}

function isUnlocked(name) {
  for (const [req, dependents] of Object.entries(ramos)) {
    if (dependents.includes(name) && !approved.has(req)) {
      return false;
    }
  }
  return true;
}

function updateProgress() {
  const percent = Math.round((approved.size / allRamos.length) * 100);
  document.getElementById("progress-bar").value = percent;
  document.getElementById("progress-text").textContent = `${percent}%`;
}

function init() {
  allRamos.forEach(name => createRamo(name));

  // Desbloquear ramos sin requisitos
  allRamos.forEach(name => {
    if (isUnlocked(name)) {
      const div = document.querySelector(`.ramo[data-name="${name}"]`);
      if (div) div.classList.remove("locked");
    }
  });
}

init();
