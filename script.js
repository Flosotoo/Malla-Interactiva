document.addEventListener("DOMContentLoaded", function () {
  const ramos = document.querySelectorAll(".ramo");
  const progreso = document.getElementById("progreso");

  // Cargar estado guardado
  const estadoGuardado = JSON.parse(localStorage.getItem("estadoRamos")) || {};

  ramos.forEach((ramo) => {
    const nombre = ramo.dataset.nombre;
    if (estadoGuardado[nombre]) {
      const { aprobado, nota } = estadoGuardado[nombre];
      if (aprobado) {
        ramo.classList.add("aprobado");
        if (nota !== undefined) {
          ramo.setAttribute("data-nota", nota);
          ramo.textContent = `${nombre} - ${nota}`;
        }
      }
    }

    // Inicialmente bloquear si tiene requisitos
    if (ramo.dataset.requiere) {
      ramo.classList.add("bloqueado");
    }

    // Click para aprobar ramo
    ramo.addEventListener("click", function () {
      if (ramo.classList.contains("bloqueado")) return;

      const nota = prompt("Ingresa la nota (1.0 a 7.0):");
      const notaFloat = parseFloat(nota);

      if (!isNaN(notaFloat) && notaFloat >= 1.0 && notaFloat <= 7.0) {
        ramo.classList.add("aprobado");
        ramo.setAttribute("data-nota", notaFloat);
        ramo.textContent = `${nombre} - ${notaFloat}`;
        estadoGuardado[nombre] = { aprobado: true, nota: notaFloat };

        // Desbloquear ramos dependientes
        const desbloquea = ramo.dataset.desbloquea.split(",").map(r => r.trim());
        desbloquea.forEach((rDesbloqueado) => {
          document.querySelectorAll(`[data-nombre="${rDesbloqueado}"]`).forEach((targetRamo) => {
            const requisitos = targetRamo.dataset.requiere.split(",").map(r => r.trim());
            const todosAprobados = requisitos.every(req => {
              return estadoGuardado[req]?.aprobado;
            });
            if (todosAprobados) {
              targetRamo.classList.remove("bloqueado");
            }
          });
        });

        guardarEstado();
        actualizarProgreso();
        calcularPromedios();
      } else {
        alert("Nota inválida. Debe estar entre 1.0 y 7.0");
      }
    });
  });

  function guardarEstado() {
    localStorage.setItem("estadoRamos", JSON.stringify(estadoGuardado));
  }

  function actualizarProgreso() {
    const total = ramos.length;
    const aprobados = [...ramos].filter((r) => r.classList.contains("aprobado")).length;
    const porcentaje = (aprobados / total) * 100;
    progreso.style.width = `${porcentaje}%`;
  }

  function calcularPromedios() {
    const semestres = document.querySelectorAll(".semestre");

    semestres.forEach((semestre) => {
      const ramosSemestre = semestre.querySelectorAll(".ramo.aprobado");
      const notas = [...ramosSemestre]
        .map((r) => parseFloat(r.dataset.nota))
        .filter((nota) => !isNaN(nota));

      const promedioDiv = semestre.querySelector(".promedio");
      if (notas.length > 0) {
        const promedio = (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2);
        promedioDiv.textContent = `Promedio: ${promedio}`;

        if (promedio >= 6.0) {
          promedioDiv.style.color = "green";
        } else {
          promedioDiv.style.color = "";
        }
      } else {
        promedioDiv.textContent = "";
      }
    });
  }

  // Ejecutar inicialización
  actualizarProgreso();
  calcularPromedios();
});
