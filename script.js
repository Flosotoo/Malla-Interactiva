document.addEventListener('DOMContentLoaded', () => {
  const ramos = document.querySelectorAll('.ramo');
  const progresoBarra = document.getElementById('progresoBarra');
  const progresoTexto = document.getElementById('progresoTexto');

  // Cargar estado almacenado
  ramos.forEach(ramo => {
    const nombre = ramo.dataset.nombre;
    const aprobado = localStorage.getItem(`aprobado_${nombre}`) === 'true';

    if (aprobado) {
      ramo.classList.add('aprobado');
    }

    const requisitos = ramo.dataset.desbloquea?.split(',').map(r => r.trim()).filter(r => r);
    if (!requisitos || requisitos.every(req => localStorage.getItem(`aprobado_${req}`) === 'true')) {
      ramo.classList.add('desbloqueado');
    }
  });

  actualizarProgreso();

  // Evento de click en ramos
  ramos.forEach(ramo => {
    ramo.addEventListener('click', () => {
      if (!ramo.classList.contains('desbloqueado')) {
        alert('Este ramo aún no está desbloqueado.');
        return;
      }

      const nombre = ramo.dataset.nombre;
      ramo.classList.add('aprobado');
      localStorage.setItem(`aprobado_${nombre}`, true);

      desbloquearRamos();
      actualizarProgreso();
    });
  });

  function desbloquearRamos() {
    ramos.forEach(ramo => {
      if (ramo.classList.contains('aprobado')) return;

      const requisitos = ramo.dataset.desbloquea?.split(',').map(r => r.trim()).filter(r => r);
      if (!requisitos || requisitos.every(req => localStorage.getItem(`aprobado_${req}`) === 'true')) {
        ramo.classList.add('desbloqueado');
      }
    });
  }

  function actualizarProgreso() {
    const total = ramos.length;
    const aprobados = [...ramos].filter(r => r.classList.contains('aprobado')).length;
    const porcentaje = Math.round((aprobados / total) * 100);
    progresoBarra.style.width = `${porcentaje}%`;
    progresoTexto.textContent = `${porcentaje}% Completado`;
  }
});

// Función para reiniciar la malla
function reiniciarMalla() {
  if (confirm('¿Estás seguro de que quieres reiniciar todos los datos?')) {
    localStorage.clear();
    location.reload();
  }
}
