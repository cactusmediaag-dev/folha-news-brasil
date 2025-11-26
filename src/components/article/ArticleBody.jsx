import React from "react";

export default function ArticleBody({ content }) {
  if (!content) return null;

  return (
    <div className="max-w-[800px] mx-auto px-4 mb-12">
      <div 
        className="article-content prose prose-lg max-w-none
          prose-headings:font-bold prose-headings:text-[#1A1A1A]
          prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
          prose-p:text-[#333333] prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-[#D71E1F] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[#1A1A1A] prose-strong:font-semibold
          prose-blockquote:border-l-4 prose-blockquote:border-[#D71E1F] 
          prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-6
          prose-blockquote:bg-gray-50 prose-blockquote:rounded-r-lg
          prose-blockquote:italic prose-blockquote:text-gray-700
          prose-ul:my-4 prose-ul:pl-6
          prose-ol:my-4 prose-ol:pl-6
          prose-li:text-[#333333] prose-li:text-lg prose-li:mb-2
          prose-img:rounded-lg prose-img:shadow-md prose-img:my-8
          prose-figure:my-8
          prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-gray-500 prose-figcaption:mt-2
        "
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <style>{`
        .article-content {
          font-family: 'Titillium Web', sans-serif;
          font-size: 18px;
          line-height: 1.6;
          color: #333333;
        }
        
        .article-content p {
          margin-bottom: 1.5rem;
        }
        
        .article-content blockquote {
          border-left: 4px solid #D71E1F;
          padding-left: 1.5rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          margin: 1.5rem 0;
          background-color: #f9fafb;
          border-radius: 0 0.5rem 0.5rem 0;
          font-style: italic;
        }
        
        .article-content blockquote p {
          margin-bottom: 0;
        }
        
        .article-content ul, .article-content ol {
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        
        .article-content li {
          margin-bottom: 0.5rem;
        }
        
        .article-content a {
          color: #D71E1F;
          text-decoration: none;
        }
        
        .article-content a:hover {
          text-decoration: underline;
        }
        
        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 2rem auto;
          display: block;
        }
        
        .article-content iframe {
          max-width: 100%;
          margin: 2rem auto;
          display: block;
          border-radius: 0.5rem;
        }
        
        .article-content h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          color: #1A1A1A;
        }
        
        .article-content h3 {
          font-size: 1.375rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          color: #1A1A1A;
        }
      `}</style>
    </div>
  );
}