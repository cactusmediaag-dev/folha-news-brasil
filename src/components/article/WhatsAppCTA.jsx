import React from "react";

const WHATSAPP_LINK = "https://chat.whatsapp.com/DMrBsFaJdCIB5A7RAi4kw4";

export default function WhatsAppCTA() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: 'linear-gradient(135deg, #075E54 0%, #128C7E 60%, #25D366 100%)',
        borderRadius: '14px',
        padding: '18px 24px',
        margin: '32px 0',
        textDecoration: 'none',
        boxShadow: '0 6px 24px rgba(37, 211, 102, 0.35)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 10px 32px rgba(37, 211, 102, 0.45)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 6px 24px rgba(37, 211, 102, 0.35)';
      }}
    >
      {/* WhatsApp Icon */}
      <div style={{
        width: '52px',
        height: '52px',
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 2C7.82 2 2 7.82 2 15c0 2.28.6 4.42 1.65 6.28L2 28l6.93-1.62A12.93 12.93 0 0 0 15 28c7.18 0 13-5.82 13-13S22.18 2 15 2zm0 23.6a11.57 11.57 0 0 1-5.88-1.6l-.42-.25-4.11.96.99-3.99-.28-.44A11.6 11.6 0 0 1 3.4 15C3.4 8.58 8.58 3.4 15 3.4c6.42 0 11.6 5.18 11.6 11.6 0 6.42-5.18 11.6-11.6 11.6zm6.36-8.68c-.35-.18-2.07-1.02-2.39-1.14-.32-.12-.55-.18-.78.18-.23.35-.9 1.14-1.1 1.37-.2.23-.4.26-.74.09-.35-.18-1.47-.54-2.8-1.72-1.03-.92-1.73-2.06-1.93-2.41-.2-.35-.02-.54.15-.71.15-.16.35-.4.52-.6.17-.2.23-.35.35-.58.12-.23.06-.44-.03-.62-.09-.18-.78-1.88-1.07-2.57-.28-.68-.57-.59-.78-.6l-.67-.01c-.23 0-.61.09-.93.43-.32.35-1.22 1.19-1.22 2.9 0 1.71 1.25 3.36 1.42 3.59.18.23 2.46 3.76 5.96 5.27.83.36 1.48.57 1.99.73.84.27 1.6.23 2.2.14.67-.1 2.07-.85 2.36-1.66.29-.82.29-1.52.2-1.66-.08-.14-.31-.23-.66-.41z" fill="white"/>
        </svg>
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <p style={{
          color: 'rgba(255,255,255,0.85)',
          fontSize: '13px',
          fontWeight: 500,
          margin: '0 0 4px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Fique por dentro das últimas notícias
        </p>
        <p style={{
          color: '#ffffff',
          fontSize: '17px',
          fontWeight: 700,
          margin: 0,
          lineHeight: 1.3,
        }}>
          Entre no nosso grupo do WhatsApp! 📲
        </p>
      </div>

      {/* Arrow button */}
      <div style={{
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '50px',
        padding: '10px 18px',
        color: 'white',
        fontSize: '14px',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        Entrar
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </a>
  );
}