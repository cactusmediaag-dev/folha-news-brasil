import React from "react";
import WhatsAppCTA from "./WhatsAppCTA";

function injectWhatsAppCTA(html) {
  if (!html) return { before: "", after: "" };

  // Split by </p> tags to find paragraph boundaries
  const parts = html.split(/(<\/p>)/i);
  
  // Find the index of the 2nd closing </p>
  let pCount = 0;
  let splitIndex = -1;
  for (let i = 0; i < parts.length; i++) {
    if (/^<\/p>$/i.test(parts[i])) {
      pCount++;
      if (pCount === 2) {
        splitIndex = i + 1;
        break;
      }
    }
  }

  if (splitIndex === -1 || pCount < 2) {
    return { before: html, after: "" };
  }

  const before = parts.slice(0, splitIndex).join("");
  const after = parts.slice(splitIndex).join("");
  return { before, after };
}

export default function ArticleBody({ content }) {
  if (!content) return null;

  const { before, after } = injectWhatsAppCTA(content);

  const styles = `
    .article-body {
      font-size: 19px;
      line-height: 1.8;
      color: #2D3748;
    }
    .article-body p {
      text-align: justify;
      text-justify: inter-word;
      hyphens: none !important;
      -webkit-hyphens: none !important;
      -ms-hyphens: none !important;
      margin-bottom: 20px;
      line-height: 1.8;
    }
    .article-body h2 {
      font-size: 1.875rem;
      font-weight: 700;
      margin-top: 3rem;
      margin-bottom: 1.25rem;
      color: #1A1A1A;
      line-height: 1.3;
    }
    .article-body h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      color: #1A1A1A;
      line-height: 1.3;
    }
    .article-body blockquote {
      border-left: 4px solid #D71E1F;
      padding: 1.5rem 2rem;
      margin: 2rem 0;
      background-color: #f9fafb;
      border-radius: 0 0.75rem 0.75rem 0;
      font-style: italic;
      font-size: 1.125rem;
      color: #4A5568;
    }
    .article-body blockquote p { margin-bottom: 0; }
    .article-body ul, .article-body ol {
      padding-left: 2rem;
      margin: 1.5rem 0;
    }
    .article-body li { margin-bottom: 0.75rem; }
    .article-body a {
      color: #D71E1F;
      text-decoration: none;
      font-weight: 500;
    }
    .article-body a:hover { text-decoration: underline; }
    .article-body img {
      max-width: 100%;
      height: auto;
      border-radius: 0.75rem;
      margin: 2.5rem auto;
      display: block;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .article-body iframe {
      max-width: 100%;
      margin: 2.5rem auto;
      display: block;
      border-radius: 0.75rem;
    }
    .article-body strong {
      font-weight: 600;
      color: #1A1A1A;
    }
    @media (max-width: 768px) {
      .article-body { font-size: 17px; line-height: 1.75; }
      .article-body p { text-align: left; }
      .article-body h2 { font-size: 1.5rem; }
      .article-body h3 { font-size: 1.25rem; }
    }
  `;

  return (
    <div className="article-content-wrapper">
      <style>{styles}</style>

      {after ? (
        <>
          <div className="article-body" dangerouslySetInnerHTML={{ __html: before }} />
          <WhatsAppCTA />
          <div className="article-body" dangerouslySetInnerHTML={{ __html: after }} />
        </>
      ) : (
        <div className="article-body" dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </div>
  );
}