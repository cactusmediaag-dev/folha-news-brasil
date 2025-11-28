// Design System - Cores das Categorias (Sólidas - para badges, etc)
export const CATEGORY_COLORS = {
  'politica': '#B71C1C',
  'economia': '#2E7D32',
  'esportes': '#EF6C00',
  'entretenimento': '#9C27B0',
  'tecnologia': '#0288D1',
  'saude': '#009688',
  'educacao': '#FBC02D',
  'mundo': '#1565C0',
  'brasil': '#43A047',
  'local': '#607D8B',
  'cidade': '#546E7A',
  'turismo': '#00BCD4',
  'transporte': '#455A64',
  'musica': '#E91E63',
  'ciencia': '#673AB7'
};

// Gradientes Vibrantes para Headers de Categoria (Alto Contraste)
export const CATEGORY_GRADIENTS = {
  'politica': 'linear-gradient(135deg, #C62828 0%, #E53935 100%)',
  'economia': 'linear-gradient(135deg, #1B5E20 0%, #43A047 100%)',
  'esportes': 'linear-gradient(135deg, #E65100 0%, #FF6D00 100%)',
  'tecnologia': 'linear-gradient(135deg, #01579B 0%, #0288D1 100%)',
  'mundo': 'linear-gradient(135deg, #1A237E 0%, #3949AB 100%)',
  'entretenimento': 'linear-gradient(135deg, #6A1B9A 0%, #AB47BC 100%)',
  'musica': 'linear-gradient(135deg, #AD1457 0%, #EC407A 100%)',
  'ciencia': 'linear-gradient(135deg, #4527A0 0%, #7E57C2 100%)',
  'saude': 'linear-gradient(135deg, #00695C 0%, #26A69A 100%)',
  'cidade': 'linear-gradient(135deg, #37474F 0%, #607D8B 100%)',
  'local': 'linear-gradient(135deg, #37474F 0%, #607D8B 100%)',
  'educacao': 'linear-gradient(135deg, #F57F17 0%, #FFCA28 100%)',
  'brasil': 'linear-gradient(135deg, #00695C 0%, #4CAF50 100%)',
  'turismo': 'linear-gradient(135deg, #006064 0%, #00ACC1 100%)',
  'transporte': 'linear-gradient(135deg, #263238 0%, #455A64 100%)',
  'default': 'linear-gradient(135deg, #1A1A1A 0%, #424242 100%)'
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