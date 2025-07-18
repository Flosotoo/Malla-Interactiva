document.addEventListener('DOMContentLoaded', () => {
  const ramos = document.querySelectorAll('.ramo');
  const progresoBarra = document.getElementById('progresoBarra');
  const progresoTexto = document.getElementById('progresoTexto');
  const promedioSemestre = document.querySelectorAll('.promedio');
  const botonReiniciar = document.getElementById('reiniciar');

  // Cargar datos almacenados
  ramos.forEach(ramo => {
    const id = ramo.dataset.id;
    const aprobado = localStorage.getItem(`aprobado_${id}`) === 'true';
    const nota = localStorage.getItem(`nota_${id}`);

    if (aprobado) {
      ramo.classList.add('aprobado');
    }

    if (nota) {
      const spanNota = document.createElement('span');
      spanNota.textContent = ` (Nota: ${nota})`;
      ramo.appendChild(spanNota);
    }

    const requisitos = ramo.dataset.requisitos?.split(',').map(r => r.trim()).filter(r => r);
    if (!requisitos || requisitos.every(req => localStorage.getItem(`aprobado_${req}`) === 'true')) {
      ramo.classList.add('desbloqueado');
    }
  });

  actualizarProgreso();
  actualizarPromedios();

  ramos.forEach(ramo => {
    ramo.addEventListener('click', () => {
      if (!ramo.classList.contains('desbloqueado')) {
        alert('Este ramo aún no está desbloqueado.');
        return;
      }

      const id = ramo.dataset.id;
      const nota = prompt(`Ingresa tu nota final para "${ramo.textContent.trim()}":`);

      if (nota === null) return; // Cancelado
      const notaNum = parseFloat(nota);
      if (isNaN(notaNum) || notaNum < 1 || notaNum > 7) {
        alert('Nota inválida. Debe ser un número entre 1.0 y 7.0');
        return;
      }

      ramo.classList.add('aprobado');
      localStorage.setItem(`aprobado_${id}`, true);
      localStorage.setItem(`nota_${id}`, notaNum);

      if (!ramo.querySelector('span')) {
        const spanNota = document.createElement('span');
        spanNota.textContent = ` (Nota: ${notaNum})`;
        ramo.appendChild(spanNota);
      }

      desbloquearRamos();
      actualizarProgreso();
      actualizarPromedios();
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

  function actualizarPromedios() {
    promedioSemestre.forEach(span => {
      const semestre = span.closest('.semestre');
      const ramosSemestre = semestre.querySelectorAll('.ramo.aprobado');
      const notas = [];

      ramosSemestre.forEach(r => {
        const id = r.dataset.id;
        const nota = parseFloat(localStorage.getItem(`nota_${id}`));
        if (!isNaN(nota)) notas.push(nota);
      });

      if (notas.length > 0) {
        const promedio = (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2);
        span.textContent = `Promedio del semestre: ${promedio}`;
        span.classList.remove('alto');

        if (parseFloat(promedio) >= 6.0) {
          span.classList.add('alto');
        }
      } else {
        span.textContent = 'Promedio del semestre: —';
      }
    });
  }

  botonReiniciar.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres reiniciar todos los datos?')) {
      localStorage.clear();
      location.reload();
    }
  });
});
