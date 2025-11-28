import React, { useState, useEffect } from "react";
import TopBar from "@/components/home/TopBar";
import BrandingHeader from "@/components/home/BrandingHeader";
import Footer from "@/components/home/Footer";
import { FileText, Shield, Users, Eye, Mail, ChevronUp } from "lucide-react";

const sections = [
  { id: "dados", label: "Dados Coletados", icon: FileText },
  { id: "finalidade", label: "Finalidade", icon: Eye },
  { id: "compartilhamento", label: "Compartilhamento", icon: Users },
  { id: "direitos", label: "Seus Direitos", icon: Shield },
  { id: "contato", label: "Contato", icon: Mail },
];

export default function Privacidade() {
  const [activeSection, setActiveSection] = useState("dados");

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((s) => ({
        id: s.id,
        element: document.getElementById(s.id),
      }));

      for (const section of sectionElements) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <BrandingHeader />

      <main className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
            
            {/* Sticky Sidebar - Desktop */}
            <aside className="hidden lg:block">
              <nav className="sticky top-24 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Navegação
                </h4>
                <ul className="space-y-1">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm font-medium transition-all ${
                          activeSection === section.id
                            ? "bg-[#D71E1F] text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <section.icon className="w-4 h-4" />
                        {section.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Main Content */}
            <article className="bg-white rounded-xl shadow-sm p-6 md:p-12 border border-gray-100">
              {/* Header */}
              <header className="mb-10 pb-8 border-b border-gray-100">
                <h1
                  className="text-2xl md:text-[32px] font-bold mb-4"
                  style={{
                    fontFamily: "'Overpass', sans-serif",
                    color: "#D71E1F",
                    lineHeight: 1.2,
                  }}
                >
                  Aviso Legal e Política de Privacidade
                </h1>
                <p className="text-gray-500 text-sm">
                  Última atualização: 28 de Novembro de 2025
                </p>
              </header>

              {/* Introduction */}
              <div className="prose-content">
                <p>
                  O <strong>Folha News Brasil</strong> está comprometido com a proteção da sua privacidade. 
                  Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos 
                  suas informações pessoais quando você utiliza nosso portal de notícias.
                </p>
                <p>
                  Ao acessar e utilizar o site folhanewsbrasil.com.br, você concorda com os termos 
                  descritos nesta política. Recomendamos a leitura atenta de todo o conteúdo.
                </p>

                {/* Section 1 */}
                <section id="dados">
                  <h3>1. Dados Coletados</h3>
                  <p>
                    Podemos coletar os seguintes tipos de informações quando você acessa nosso site:
                  </p>
                  <ul>
                    <li>
                      <strong>Dados de navegação:</strong> Endereço IP, tipo de navegador, páginas visitadas, 
                      tempo de permanência, data e hora de acesso.
                    </li>
                    <li>
                      <strong>Dados de dispositivo:</strong> Tipo de dispositivo, sistema operacional, 
                      resolução de tela.
                    </li>
                    <li>
                      <strong>Cookies:</strong> Utilizamos cookies para melhorar sua experiência de navegação, 
                      personalizar conteúdo e anúncios, e analisar nosso tráfego.
                    </li>
                    <li>
                      <strong>Dados fornecidos voluntariamente:</strong> Nome, e-mail e outras informações 
                      que você fornecer ao se cadastrar em newsletters, enviar comentários ou entrar em contato.
                    </li>
                  </ul>
                </section>

                {/* Section 2 */}
                <section id="finalidade">
                  <h3>2. Finalidade do Uso dos Dados</h3>
                  <p>
                    As informações coletadas são utilizadas para as seguintes finalidades:
                  </p>
                  <ul>
                    <li>Fornecer e melhorar nossos serviços de notícias;</li>
                    <li>Personalizar sua experiência de navegação;</li>
                    <li>Enviar newsletters e comunicações relevantes (mediante consentimento);</li>
                    <li>Exibir anúncios relevantes através de parceiros de publicidade;</li>
                    <li>Realizar análises estatísticas e de desempenho do site;</li>
                    <li>Cumprir obrigações legais e regulatórias;</li>
                    <li>Prevenir fraudes e garantir a segurança do site.</li>
                  </ul>
                </section>

                {/* Section 3 */}
                <section id="compartilhamento">
                  <h3>3. Compartilhamento de Dados</h3>
                  <p>
                    O Folha News Brasil pode compartilhar suas informações com:
                  </p>
                  <ul>
                    <li>
                      <strong>Parceiros de publicidade:</strong> Google AdSense, redes de anúncios e 
                      plataformas de mídia programática para exibição de anúncios personalizados.
                    </li>
                    <li>
                      <strong>Ferramentas de análise:</strong> Google Analytics e similares para 
                      entender o comportamento dos usuários.
                    </li>
                    <li>
                      <strong>Redes sociais:</strong> Quando você compartilha conteúdo em plataformas 
                      como Facebook, Twitter, WhatsApp.
                    </li>
                    <li>
                      <strong>Autoridades legais:</strong> Quando exigido por lei ou ordem judicial.
                    </li>
                  </ul>
                  <p>
                    <strong>Importante:</strong> Não vendemos suas informações pessoais para terceiros.
                  </p>
                </section>

                {/* Section 4 */}
                <section id="direitos">
                  <h3>4. Seus Direitos (LGPD)</h3>
                  <p>
                    De acordo com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018), 
                    você possui os seguintes direitos:
                  </p>
                  <ul>
                    <li>
                      <strong>Acesso:</strong> Solicitar informações sobre quais dados pessoais 
                      possuímos sobre você.
                    </li>
                    <li>
                      <strong>Correção:</strong> Solicitar a correção de dados incompletos, 
                      inexatos ou desatualizados.
                    </li>
                    <li>
                      <strong>Eliminação:</strong> Solicitar a exclusão de seus dados pessoais.
                    </li>
                    <li>
                      <strong>Portabilidade:</strong> Solicitar a transferência de seus dados 
                      para outro serviço.
                    </li>
                    <li>
                      <strong>Revogação do consentimento:</strong> Retirar seu consentimento 
                      a qualquer momento.
                    </li>
                    <li>
                      <strong>Oposição:</strong> Opor-se ao tratamento de dados em determinadas situações.
                    </li>
                  </ul>
                  <p>
                    Para exercer qualquer um desses direitos, entre em contato conosco através 
                    dos canais indicados abaixo.
                  </p>
                </section>

                {/* Section 5 */}
                <section id="contato">
                  <h3>5. Contato</h3>
                  <p>
                    Para dúvidas, solicitações ou exercício de seus direitos relacionados à 
                    privacidade, entre em contato:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-6 mt-4">
                    <p className="mb-2">
                      <strong>Folha News Brasil</strong>
                    </p>
                    <p className="mb-2">
                      <strong>E-mail:</strong>{" "}
                      <a href="mailto:privacidade@folhanewsbrasil.com.br" className="text-[#D71E1F] hover:underline">
                        privacidade@folhanewsbrasil.com.br
                      </a>
                    </p>
                    <p className="mb-2">
                      <strong>Encarregado de Dados (DPO):</strong> Equipe de Proteção de Dados
                    </p>
                    <p>
                      <strong>Endereço:</strong> Cuiabá, Mato Grosso, Brasil
                    </p>
                  </div>
                </section>

                {/* Additional Sections */}
                <section>
                  <h3>6. Cookies e Tecnologias Similares</h3>
                  <p>
                    Utilizamos cookies e tecnologias similares para:
                  </p>
                  <ul>
                    <li>Lembrar suas preferências de navegação;</li>
                    <li>Manter você conectado;</li>
                    <li>Entender como você usa nosso site;</li>
                    <li>Exibir anúncios relevantes.</li>
                  </ul>
                  <p>
                    Você pode configurar seu navegador para recusar cookies, mas isso pode 
                    afetar a funcionalidade do site.
                  </p>
                </section>

                <section>
                  <h3>7. Segurança dos Dados</h3>
                  <p>
                    Adotamos medidas técnicas e organizacionais apropriadas para proteger suas 
                    informações pessoais contra acesso não autorizado, alteração, divulgação 
                    ou destruição. No entanto, nenhum método de transmissão pela internet ou 
                    armazenamento eletrônico é 100% seguro.
                  </p>
                </section>

                <section>
                  <h3>8. Alterações nesta Política</h3>
                  <p>
                    Esta Política de Privacidade pode ser atualizada periodicamente. Quaisquer 
                    alterações significativas serão comunicadas através de aviso em nosso site. 
                    Recomendamos que você revise esta página regularmente.
                  </p>
                </section>

                {/* Final Note */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <p className="text-sm text-gray-500 italic">
                    Ao continuar navegando em nosso site, você reconhece ter lido e concordado 
                    com os termos desta Política de Privacidade.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer />

      {/* Scroll to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-[#D71E1F] text-white p-3 rounded-full shadow-lg hover:bg-[#b91c1c] transition-colors z-40"
        aria-label="Voltar ao topo"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* Scoped Styles */}
      <style>{`
        .prose-content p {
          font-family: 'Overpass', sans-serif;
          font-size: 16px;
          color: #4A5568;
          line-height: 1.8;
          margin-bottom: 16px;
        }
        .prose-content h3 {
          font-family: 'Overpass', sans-serif;
          font-weight: 700;
          font-size: 20px;
          color: #333;
          margin-top: 40px;
          margin-bottom: 16px;
        }
        .prose-content ul {
          list-style-type: disc;
          padding-left: 24px;
          margin-bottom: 16px;
        }
        .prose-content li {
          font-family: 'Overpass', sans-serif;
          font-size: 16px;
          color: #4A5568;
          line-height: 1.8;
          margin-bottom: 8px;
        }
        .prose-content strong {
          color: #2D3748;
        }
        .prose-content a {
          color: #D71E1F;
          text-decoration: none;
        }
        .prose-content a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}