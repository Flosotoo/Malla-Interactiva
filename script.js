document.addEventListener("DOMContentLoaded", () => {
  const ramos = document.querySelectorAll(".ramo");

  // Estado inicial: desbloquear todos los que no tienen requisitos
  ramos.forEach(ramo => {
    if (!ramo.dataset.requisitos) {
      ramo.classList.add("desbloqueado");
    }
  });

  // Evento de click para aprobar ramos
  ramos.forEach(ramo => {
    ramo.addEventListener("click", () => {
      // Solo permite aprobar si está desbloqueado
      if (ramo.classList.contains("desbloqueado") && !ramo.classList.contains("aprobado")) {
        ramo.classList.add("aprobado");

        // Desbloquear los ramos que dependían de este
        const id = ramo.dataset.id;
        ramos.forEach(siguiente => {
          const requisitos = siguiente.dataset.requisitos.split(",");
          if (requisitos.includes(id)) {
            siguiente.classList.add("desbloqueado");
          }
        });
      }
    });
  });
});
