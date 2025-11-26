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

// Gradientes Suaves para Headers de Categoria
export const CATEGORY_GRADIENTS = {
  'politica': 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
  'economia': 'linear-gradient(135deg, #43C6AC 0%, #F8FFAE 100%)',
  'esportes': 'linear-gradient(135deg, #F2994A 0%, #F2C94C 100%)',
  'tecnologia': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'mundo': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'entretenimento': 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
  'musica': 'linear-gradient(135deg, #f77062 0%, #fe5196 100%)',
  'ciencia': 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'saude': 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  'cidade': 'linear-gradient(135deg, #93a5cf 0%, #e4efe9 100%)',
  'local': 'linear-gradient(135deg, #93a5cf 0%, #e4efe9 100%)',
  'educacao': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'brasil': 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  'turismo': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'transporte': 'linear-gradient(135deg, #536976 0%, #292E49 100%)',
  'default': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
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