// Cada materia recibe siempre el mismo color, calculado a partir de su nombre.
// Tonos apagados para convivir con la paleta verde. Se evita el rojo: queda reservado para lo vencido.
const PALETTE = [
  { bg: '#e8f0dc', fg: '#46602f', stripe: '#8da868' },
  { bg: '#e3edf5', fg: '#36597a', stripe: '#7fa3c4' },
  { bg: '#f6ead9', fg: '#7a5427', stripe: '#d0a46a' },
  { bg: '#efe4f1', fg: '#6a4675', stripe: '#b291bd' },
  { bg: '#e6e9f0', fg: '#454f6b', stripe: '#8c97b5' },
  { bg: '#dff0ec', fg: '#2f6559', stripe: '#6fb3a3' }
];
export function subjectColor(subject = '') {
  const key = subject.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}
