const ramos = document.querySelectorAll('.ramo');
const aprobados = new Set();

// 🔁 Actualiza estado de ramos según sus requisitos
function actualizarRamos() {
  ramos.forEach(ramo => {
    const requisitos = ramo.dataset.requisitos?.split(',').map(r => r.trim()) || [];

    const desbloqueado = requisitos.every(req => 
      aprobados.has(req) || req.includes("DEL SEMESTRE")
    );

    if (desbloqueado && !ramo.classList.contains('aprobado')) {
      ramo.classList.remove('bloqueado');
    } else if (!desbloqueado && !ramo.classList.contains('aprobado')) {
      ramo.classList.add('bloqueado');
    }
  });
}

// ✅ Actualiza barra de progreso
function actualizarProgreso() {
  const total = ramos.length;
  const completados = aprobados.size;
  const porcentaje = Math.round((completados / total) * 100);

  document.getElementById("progreso").style.width = `${porcentaje}%`;
  document.getElementById("progreso-text").textContent = `${porcentaje}% Completado`;
}

// 🖱️ Al hacer clic en un ramo
ramos.forEach(ramo => {
  ramo.classList.add('bloqueado'); // Todos comienzan bloqueados, luego se actualizan

  ramo.addEventListener('click', () => {
    if (ramo.classList.contains('bloqueado') || ramo.classList.contains('aprobado')) return;

    const nombre = ramo.dataset.nombre;
    const nota = prompt(`Ingresa la nota final para "${nombre}" (1.0 a 7.0):`, "4.0");
    const notaNum = parseFloat(nota);

    if (isNaN(notaNum) || notaNum < 1.0 || notaNum > 7.0) {
      alert("Nota inválida. Ingresa un número entre 1.0 y 7.0.");
      return;
    }

    ramo.classList.add("aprobado");
    if (notaNum >= 6.0) {
      ramo.classList.add("califica");
    }

    const notaDiv = document.createElement("div");
    notaDiv.classList.add("nota");
    notaDiv.textContent = `Nota: ${notaNum}`;
    ramo.appendChild(notaDiv);

    aprobados.add(nombre);

    // Desbloquea los ramos que este ramo habilita
    const abre = ramo.dataset.abre?.split(',').map(r => r.trim()) || [];
    abre.forEach(dep => {
      const depElem = Array.from(ramos).find(el => el.dataset.nombre === dep);
      if (depElem) {
        const requisitos = depElem.dataset.requisitos?.split(',').map(r => r.trim()) || [];
        const cumple = requisitos.every(req => aprobados.has(req) || req.includes("DEL SEMESTRE"));
        if (cumple) depElem.classList.remove("bloqueado");
      }
    });

    actualizarRamos();
    actualizarProgreso();
  });
});

// 🟡 Iniciar desbloqueo inicial al cargar
actualizarRamos();
actualizarProgreso();
