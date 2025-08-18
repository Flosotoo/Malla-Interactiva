document.addEventListener('DOMContentLoaded', () => {
  const ramos = document.querySelectorAll('.ramo');
  const progresoBarra = document.getElementById('progresoBarra');
  const progresoTexto = document.getElementById('progresoTexto');
  const botonReiniciar = document.getElementById('reiniciar');

  // Cargar datos almacenados
  ramos.forEach(ramo => {
    const id = ramo.dataset.id;
    const aprobado = localStorage.getItem(`aprobado_${id}`) === 'true';

    if (aprobado) {
      ramo.classList.add('aprobado');
    }

    const requisitos = ramo.dataset.requisitos?.split(',').map(r => r.trim()).filter(r => r);
    if (!requisitos || requisitos.every(req => localStorage.getItem(`aprobado_${req}`) === 'true')) {
      ramo.classList.add('desbloqueado');
    }
  });

  actualizarProgreso();

  ramos.forEach(ramo => {
    ramo.addEventListener('click', () => {
      if (!ramo.classList.contains('desbloqueado')) {
        alert('Este ramo aún no está desbloqueado.');
        return;
      }

      const id = ramo.dataset.id;

      ramo.classList.add('aprobado');
      localStorage.setItem(`aprobado_${id}`, true);

      desbloquearRamos();
      actualizarProgreso();
    });
  });

  function desbloquearRamos() {
    ramos.forEach(ramo => {
      if (ramo.classList.contains('aprobado')) return;

      const requisitos = ramo.dataset.requisitos?.split(',').map(r => r.trim()).filter(r => r);
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

  botonReiniciar.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres reiniciar todos los datos?')) {
      localStorage.clear();
      location.reload();
    }
  });
});
