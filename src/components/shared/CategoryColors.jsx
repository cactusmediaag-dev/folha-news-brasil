// Design System - Cores das Categorias
export const CATEGORY_COLORS = {
  'politica': '#B71C1C',      // Vermelho Escuro
  'economia': '#2E7D32',      // Verde Dinheiro
  'esportes': '#EF6C00',      // Laranja Vibrante
  'entretenimento': '#9C27B0', // Roxo
  'tecnologia': '#0288D1',    // Azul Tech
  'saude': '#009688',         // Verde Água
  'educacao': '#FBC02D',      // Amarelo/Ouro
  'mundo': '#1565C0',         // Azul Escuro
  'brasil': '#43A047',        // Verde Bandeira
  'local': '#607D8B',         // Cinza Urbano
  'cidade': '#546E7A',        // Azul Acinzentado
  'turismo': '#00BCD4',       // Ciano
  'transporte': '#455A64',    // Grafite
  'musica': '#E91E63',        // Rosa Choque
  'ciencia': '#673AB7'        // Índigo
};

export const CATEGORY_LABELS = {
  'politica': 'Política',
  'economia': 'Economia',
  'esportes': 'Esportes',
  'entretenimento': 'Entretenimento',
  'tecnologia': 'Tecnologia',
  'saude': 'Saúde',
  'educacao': 'Educação',
  'mundo': 'Mundo',
  'brasil': 'Brasil',
  'local': 'Local',
  'cidade': 'Cidade',
  'turismo': 'Turismo',
  'transporte': 'Transporte',
  'musica': 'Música',
  'ciencia': 'Ciência'
};

export const CATEGORIES_LIST = [
  { value: "politica", label: "Política" },
  { value: "economia", label: "Economia" },
  { value: "esportes", label: "Esportes" },
  { value: "entretenimento", label: "Entretenimento" },
  { value: "tecnologia", label: "Tecnologia" },
  { value: "saude", label: "Saúde" },
  { value: "educacao", label: "Educação" },
  { value: "mundo", label: "Mundo" },
  { value: "brasil", label: "Brasil" },
  { value: "local", label: "Local" },
  { value: "cidade", label: "Cidade" },
  { value: "turismo", label: "Turismo" },
  { value: "transporte", label: "Transporte" },
  { value: "musica", label: "Música" },
  { value: "ciencia", label: "Ciência" },
];

// Função para escurecer cor (para bordas)
export const darkenColor = (hex, percent = 20) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max((num >> 16) - amt, 0);
  const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
  const B = Math.max((num & 0x0000FF) - amt, 0);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
};