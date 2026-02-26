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
  'ciencia': '#673AB7',
  // Novas Categorias
  'nacional': '#009c3b',
  'auto': '#2c3e50',
  'inteligencia-artificial': '#b00bf9',
  'nasa': '#0b1e3b',
  'curiosidades': '#F7971E',
  'viagem': '#2980B9',
  'gastronomia': '#eb3349',
  'viagem-gastronomia': '#AA076B',
  'policia': '#1a1a2e'
};

// Gradientes Vibrantes para Headers de Categoria (Alto Contraste)
export const CATEGORY_GRADIENTS = {
  'politica': 'linear-gradient(135deg, #C62828 0%, #E53935 100%)',
  'economia': 'linear-gradient(135deg, #1B5E20 0%, #43A047 100%)',
  'esportes': 'linear-gradient(135deg, #E65100 0%, #FF6D00 100%)',
  'tecnologia': 'linear-gradient(135deg, #00f260 0%, #0575E6 100%)',
  'mundo': 'linear-gradient(135deg, #1A237E 0%, #3949AB 100%)',
  'entretenimento': 'linear-gradient(135deg, #6A1B9A 0%, #AB47BC 100%)',
  'musica': 'linear-gradient(135deg, #AD1457 0%, #EC407A 100%)',
  'ciencia': 'linear-gradient(135deg, #1CD8D2 0%, #93EDC7 100%)',
  'saude': 'linear-gradient(135deg, #00695C 0%, #26A69A 100%)',
  'cidade': 'linear-gradient(135deg, #37474F 0%, #607D8B 100%)',
  'local': 'linear-gradient(135deg, #37474F 0%, #607D8B 100%)',
  'educacao': 'linear-gradient(135deg, #F57F17 0%, #FFCA28 100%)',
  'brasil': 'linear-gradient(135deg, #00695C 0%, #4CAF50 100%)',
  'turismo': 'linear-gradient(135deg, #006064 0%, #00ACC1 100%)',
  'transporte': 'linear-gradient(135deg, #263238 0%, #455A64 100%)',
  // Novas Categorias - Gradientes Exclusivos
  'nacional': 'linear-gradient(135deg, #009c3b 0%, #005f25 100%)',
  'auto': 'linear-gradient(135deg, #2c3e50 0%, #bdc3c7 100%)',
  'inteligencia-artificial': 'linear-gradient(135deg, #b00bf9 0%, #560a9b 100%)',
  'nasa': 'linear-gradient(135deg, #0b1e3b 0%, #1e3c72 100%)',
  'curiosidades': 'linear-gradient(135deg, #F7971E 0%, #FFD200 100%)',
  'viagem': 'linear-gradient(135deg, #2980B9 0%, #6DD5FA 100%)',
  'gastronomia': 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
  'viagem-gastronomia': 'linear-gradient(135deg, #AA076B 0%, #61045F 100%)',
  'policia': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
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
  'ciencia': 'Ciência',
  // Novas Categorias
  'nacional': 'Nacional',
  'auto': 'Auto',
  'inteligencia-artificial': 'Inteligência Artificial',
  'nasa': 'Nasa',
  'curiosidades': 'Curiosidades',
  'viagem': 'Viagem',
  'gastronomia': 'Gastronomia',
  'viagem-gastronomia': 'Viagem & Gastronomia',
  'policia': 'Polícia'
};

export const CATEGORIES_LIST = [
  // Notícias Principais
  { value: "nacional", label: "Nacional", group: "news" },
  { value: "politica", label: "Política", group: "news" },
  { value: "economia", label: "Economia", group: "news" },
  { value: "mundo", label: "Mundo", group: "news" },
  { value: "brasil", label: "Brasil", group: "news" },
  // Tech & Ciência
  { value: "tecnologia", label: "Tecnologia", group: "tech" },
  { value: "inteligencia-artificial", label: "Inteligência Artificial", group: "tech" },
  { value: "nasa", label: "Nasa", group: "tech" },
  { value: "ciencia", label: "Ciência", group: "tech" },
  // Esportes & Entretenimento
  { value: "esportes", label: "Esportes", group: "entertainment" },
  { value: "entretenimento", label: "Entretenimento", group: "entertainment" },
  { value: "musica", label: "Música", group: "entertainment" },
  // Lifestyle
  { value: "viagem", label: "Viagem", group: "lifestyle" },
  { value: "gastronomia", label: "Gastronomia", group: "lifestyle" },
  { value: "viagem-gastronomia", label: "Viagem & Gastronomia", group: "lifestyle" },
  { value: "turismo", label: "Turismo", group: "lifestyle" },
  { value: "auto", label: "Auto", group: "lifestyle" },
  { value: "curiosidades", label: "Curiosidades", group: "lifestyle" },
  // Saúde & Educação
  { value: "saude", label: "Saúde", group: "health" },
  { value: "educacao", label: "Educação", group: "health" },
  // Local
  { value: "cidade", label: "Cidade", group: "local" },
  { value: "local", label: "Local", group: "local" },
  { value: "transporte", label: "Transporte", group: "local" },
  // Polícia
  { value: "policia", label: "Polícia", group: "policia" },
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