// script.js

const ramos = [
  { id: 'fp', nombre: 'Fundamentos de Programación', requisitos: [], abre: ['doo'] },
  { id: 'icc', nombre: 'Introducción al Cloud Computing', requisitos: [], abre: [] },
  { id: 'bi', nombre: 'Bases de Innovación', requisitos: [], abre: ['ir'] },
  { id: 'nm', nombre: 'Nivelación Matemática', requisitos: [], abre: ['ma'] },
  { id: 'hc', nombre: 'Habilidades de Comunicación', requisitos: [], abre: [] },
  { id: 'doo', nombre: 'Desarrollo Orientado a Objetos', requisitos: ['fp'], abre: ['dfs1', 'dam', 'dfs2'] },
  { id: 'bd1', nombre: 'Base de Datos Aplicada I', requisitos: [], abre: ['bd2'] },
  { id: 'ir', nombre: 'Ingeniería de Requisitos', requisitos: ['bi'], abre: ['is'] },
  { id: 'ma', nombre: 'Matemática Aplicada', requisitos: ['nm'], abre: ['ed'] },
  { id: 'ie1', nombre: 'Inglés Elemental I', requisitos: [], abre: ['ie2'] },
  { id: 'fa', nombre: 'Fundamentos de Antropología', requisitos: [], abre: ['et'] },
  { id: 'dfs1', nombre: 'Desarrollo Fullstack I', requisitos: ['doo'], abre: ['dfs2'] },
  { id: 'bd2', nombre: 'Base de Datos Aplicada II', requisitos: ['bd1'], abre: ['tbd'] },
  { id: 'is', nombre: 'Ingeniería de Software', requisitos: ['ir'], abre: [] },
  { id: 'ie2', nombre: 'Inglés Elemental II', requisitos: ['ie1'], abre: ['ii1'] },
  { id: 'dfs2', nombre: 'Desarrollo Fullstack II', requisitos: ['dfs1', 'doo'], abre: ['dfs3'] },
  { id: 'dam', nombre: 'Desarrollo de Aplicaciones Móviles', requisitos: ['doo'], abre: [] },
  { id: 'tbd', nombre: 'Taller de Base de Datos', requisitos: ['bd2'], abre: [] },
  { id: 'ed', nombre: 'Estadística Descriptiva', requisitos: ['ma'], abre: [] },
  { id: 'ii1', nombre: 'Inglés Intermedio I', requisitos: ['ie2'], abre: [] },
  { id: 'et', nombre: 'Ética para el Trabajo', requisitos: ['fa'], abre: ['ep'] },
  { id: 'dfs3', nombre: 'Desarrollo Fullstack III', requisitos: ['dfs2'], abre: ['scds'] },
  { id: 'devops', nombre: 'Introducción a Herramientas DevOps', requisitos: [], abre: [] },
  { id: 'eps', nombre: 'Evaluación de Proyectos de Software', requisitos: [], abre: ['gps'] },
  { id: 'dcn1', nombre: 'Desarrollo Cloud Native I', requisitos: [], abre: ['dcn2'] },
  { id: 'scds', nombre: 'Seguridad y Calidad en el Desarrollo de Software', requisitos: ['dfs3'], abre: [] },
  { id: 'gps', nombre: 'Gestión de Proyectos de Software', requisitos: ['eps'], abre: [] },
  { id: 'dcn2', nombre: 'Desarrollo Cloud Native II', requisitos: ['dcn1'], abre: ['tas'] },
  { id: 'ati', nombre: 'Arquitecturas TI Contemporáneas', requisitos: [], abre: ['ttv'] },
  { id: 'bpm', nombre: 'BPM Aplicado', requisitos: [], abre: [] },
  { id: 'ep', nombre: 'Ética Profesional', requisitos: ['et'], abre: [] },
  { id: 'ttv', nombre: 'Taller de Tecnologías de Vanguardia', requisitos: ['ati'], abre: [] },
  { id: 'tas', nombre: 'Taller Aplicado de Software', requisitos: ['dcn2'], abre: [] },
  { id: 'pp', nombre: 'Práctica Profesional', requisitos: ['fp','icc','bi','nm','hc','doo','bd1','ir','ma','ie1','fa','dfs1','bd2','is','ie2','dfs2','dam','tbd','ed','ii1','et','dfs3','devops','eps','dcn1','scds','gps','dcn2','ati','bpm','ep'], abre: [] }
];

let estadoRamos = JSON.parse(localStorage.getItem('estadoRamos')) || {};

function crearRamo(ramo) {
  const div = document.createElement('div');
  div.className = 'ramo';
  div.id = ramo.id;
  div.innerHTML = `<h3>${ramo.nombre}</h3>
    <input type="number" min="1" max="7" placeholder="Nota final..." ${!habilitado(ramo) ? 'disabled' : ''} />
    <div class="estado">${estadoRamos[ramo.id]?.estado || 'Pendiente'}</div>`;

  if (!habilitado(ramo)) {
    div.classList.add('bloqueado');
  }

  div.addEventListener('click', e => {
    if (!habilitado(ramo)) return;
    const nota = div.querySelector('input').value;
    if (!nota || isNaN(nota)) return alert('Ingresa una nota válida');
    const notaFinal = parseFloat(nota);

    estadoRamos[ramo.id] = {
      estado: notaFinal >= 4 ? (notaFinal >= 6 ? 'Califica' : 'Aprobado') : 'Reprobado',
      nota: notaFinal
    };

    localStorage.setItem('estadoRamos', JSON.stringify(estadoRamos));
    actualizarVista();
  });

  return div;
}

function habilitado(ramo) {
  return ramo.requisitos.every(r => estadoRamos[r]?.estado === 'Aprobado' || estadoRamos[r]?.estado === 'Califica');
}

function actualizarVista() {
  const contenedor = document.getElementById('malla');
  contenedor.innerHTML = '';
  ramos.forEach(r => {
    const elemento = crearRamo(r);
    if (estadoRamos[r.id]?.estado === 'Aprobado') elemento.classList.add('aprobado');
    if (estadoRamos[r.id]?.estado === 'Califica') elemento.classList.add('califica');
    contenedor.appendChild(elemento);
  });
  actualizarProgreso();
}

function actualizarProgreso() {
  const total = ramos.length;
  const completados = Object.values(estadoRamos).filter(e => e.estado === 'Aprobado' || e.estado === 'Califica').length;
  const porcentaje = Math.round((completados / total) * 100);
  document.getElementById('careerProgress').value = porcentaje;
  document.getElementById('progressText').textContent = `${porcentaje}%`;
}

document.addEventListener('DOMContentLoaded', actualizarVista);
