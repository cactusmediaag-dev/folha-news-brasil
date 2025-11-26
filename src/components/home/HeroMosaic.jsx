import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const categoryLabels = {
  politica: "Política",
  economia: "Economia",
  esportes: "Esportes",
  entretenimento: "Entretenimento",
  tecnologia: "Tecnologia",
  saude: "Saúde",
  educacao: "Educação",
  mundo: "Mundo",
  brasil: "Brasil",
  local: "Local",
};

const categoryColors = {
  politica: "#D71E1F",
  economia: "#2563eb",
  esportes: "#16a34a",
  entretenimento: "#9333ea",
  tecnologia: "#0891b2",
  saude: "#dc2626",
  educacao: "#ca8a04",
  mundo: "#4f46e5",
  brasil: "#15803d",
  local: "#ea580c",
};

export default function HeroMosaic({ posts = [], isLoading = false }) {
  // Filter featured posts first, then sort by date
  const featuredPosts = posts
    .filter(p => p.is_featured === true)
    .sort((a, b) => new Date(b.publish_date || b.created_date) - new Date(a.publish_date || a.created_date));
  
  // If not enough featured posts, fill with regular posts sorted by date
  const regularPosts = posts
    .filter(p => !p.is_featured)
    .sort((a, b) => new Date(b.publish_date || b.created_date) - new Date(a.publish_date || a.created_date));

  const displayPosts = featuredPosts.length >= 3 
    ? featuredPosts.slice(0, 3)
    : [...featuredPosts, ...regularPosts].slice(0, 3);

  // Loading skeleton
  if (isLoading || displayPosts.length < 3) {
    return (
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '20px',
          height: '500px',
          width: '100%'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <p style={{ color: '#6b7280', fontWeight: 600 }}>Carregando destaques...</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
            <div style={{ flex: 1, background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)', borderRadius: '12px' }}></div>
            <div style={{ flex: 1, background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)', borderRadius: '12px' }}></div>
          </div>
        </div>
      </section>
    );
  }

  const mainPost = displayPosts[0];
  const sidePost1 = displayPosts[1];
  const sidePost2 = displayPosts[2];

  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 16px' }}>
      {/* CSS Grid Container */}
      <div className="mosaic-grid" style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px',
        height: '500px',
        width: '100%'
      }}>
        
        {/* Card Principal (Esquerda - Grande) */}
        <Link
          to={`${createPageUrl("Noticia")}?slug=${mainPost.slug}`}
          className="mosaic-main-card"
          style={{
            position: 'relative',
            height: '100%',
            width: '100%',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundImage: `url(${mainPost.featured_image || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=800&fit=crop'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'block'
          }}
        >
          {/* Scrim Overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '70%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
            zIndex: 1
          }}></div>
          
          {/* Content */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '24px',
            right: '24px',
            zIndex: 2,
            color: 'white'
          }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: categoryColors[mainPost.category] || '#D71E1F',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '12px',
              textTransform: 'uppercase'
            }}>
              {categoryLabels[mainPost.category] || mainPost.category}
            </span>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '12px',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}>
              {mainPost.title}
            </h1>
            {mainPost.subtitle && (
              <p style={{
                fontSize: '1rem',
                opacity: 0.9,
                marginBottom: '12px',
                lineHeight: 1.4
              }}>
                {mainPost.subtitle}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', opacity: 0.8 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock style={{ width: '16px', height: '16px' }} />
                {format(new Date(mainPost.publish_date || mainPost.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
              {mainPost.author_name && <span>Por {mainPost.author_name}</span>}
            </div>
          </div>
        </Link>

        {/* Coluna Direita (Flex Column) */}
        <div className="mosaic-side-column" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          height: '100%'
        }}>
          
          {/* Card Topo Direita */}
          <Link
            to={`${createPageUrl("Noticia")}?slug=${sidePost1.slug}`}
            className="mosaic-side-card"
            style={{
              position: 'relative',
              flex: 1,
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundImage: `url(${sidePost1.featured_image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'block'
            }}
          >
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '70%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
              zIndex: 1
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              zIndex: 2,
              color: 'white'
            }}>
              <span style={{
                display: 'inline-block',
                backgroundColor: categoryColors[sidePost1.category] || '#D71E1F',
                color: 'white',
                padding: '3px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                marginBottom: '8px',
                textTransform: 'uppercase'
              }}>
                {categoryLabels[sidePost1.category] || sidePost1.category}
              </span>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 700,
                lineHeight: 1.3,
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}>
                {sidePost1.title}
              </h3>
            </div>
          </Link>

          {/* Card Baixo Direita */}
          <Link
            to={`${createPageUrl("Noticia")}?slug=${sidePost2.slug}`}
            className="mosaic-side-card"
            style={{
              position: 'relative',
              flex: 1,
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundImage: `url(${sidePost2.featured_image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'block'
            }}
          >
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '70%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
              zIndex: 1
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              zIndex: 2,
              color: 'white'
            }}>
              <span style={{
                display: 'inline-block',
                backgroundColor: categoryColors[sidePost2.category] || '#D71E1F',
                color: 'white',
                padding: '3px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                marginBottom: '8px',
                textTransform: 'uppercase'
              }}>
                {categoryLabels[sidePost2.category] || sidePost2.category}
              </span>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 700,
                lineHeight: 1.3,
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}>
                {sidePost2.title}
              </h3>
            </div>
          </Link>

        </div>
      </div>

      {/* Responsive CSS + Hover Effects */}
      <style>{`
        .mosaic-main-card, .mosaic-side-card {
          transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease, filter 0.3s ease;
          cursor: pointer;
        }
        
        .mosaic-main-card:hover, .mosaic-side-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
          filter: brightness(1.05);
          z-index: 10;
        }
        
        .mosaic-main-card:hover h1, .mosaic-side-card:hover h3 {
          text-decoration: underline;
          text-decoration-color: #D71E1F;
          text-underline-offset: 4px;
        }
        
        @media (max-width: 768px) {
          .mosaic-grid {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
          .mosaic-main-card {
            height: 300px !important;
          }
          .mosaic-side-column {
            height: auto !important;
          }
          .mosaic-side-card {
            height: 200px !important;
            flex: none !important;
          }
        }
      `}</style>
    </section>
  );
}