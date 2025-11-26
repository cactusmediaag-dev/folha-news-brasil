import React from "react";

export default function ArticleBody({ content }) {
  if (!content) return null;

  return (
    <div className="max-w-[1140px] mx-auto px-4 mb-16">
      {/* Article content with comfortable reading width */}
      <div 
        className="article-body max-w-[900px]"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <style>{`
        .article-body {
          font-size: 20px;
          line-height: 1.75;
          color: #2D3748;
        }
        
        .article-body p {
          margin-bottom: 1.75rem;
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
        
        .article-body blockquote p {
          margin-bottom: 0;
        }
        
        .article-body ul, .article-body ol {
          padding-left: 2rem;
          margin: 1.5rem 0;
        }
        
        .article-body li {
          margin-bottom: 0.75rem;
        }
        
        .article-body a {
          color: #D71E1F;
          text-decoration: none;
          font-weight: 500;
        }
        
        .article-body a:hover {
          text-decoration: underline;
        }
        
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
          .article-body {
            font-size: 18px;
            line-height: 1.7;
          }
          
          .article-body h2 {
            font-size: 1.5rem;
          }
          
          .article-body h3 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}