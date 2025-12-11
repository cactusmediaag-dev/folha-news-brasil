import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";

import TopBar from "@/components/home/TopBar";
import BrandingHeader from "@/components/home/BrandingHeader";
import Footer from "@/components/home/Footer";

import ArticleBreadcrumb from "@/components/article/ArticleBreadcrumb";
import ArticleHeader from "@/components/article/ArticleHeader";
import ArticleFeaturedImage from "@/components/article/ArticleFeaturedImage";
import ArticleBody from "@/components/article/ArticleBody";
import ArticleSidebar from "@/components/article/ArticleSidebar";
import RelatedPosts from "@/components/article/RelatedPosts";
import FloatingWhatsApp from "@/components/article/FloatingWhatsApp";

export default function Noticia() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get("slug");

  // Fetch the current post
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => base44.entities.Post.filter({ slug }),
    enabled: !!slug,
  });

  const post = posts[0];

  // Fetch related posts by category
  const { data: relatedPosts = [] } = useQuery({
    queryKey: ['related-posts', post?.category],
    queryFn: () => base44.entities.Post.filter({ status: 'published', category: post.category }, '-created_date', 5),
    enabled: !!post?.category,
  });

  // Update view count (in real app, this would be a separate API call)
  useEffect(() => {
    if (post?.id) {
      // Increment views - in production this would be handled by the backend
      base44.entities.Post.update(post.id, { 
        views_count: (post.views_count || 0) + 1 
      }).catch(() => {});
    }
  }, [post?.id]);

  // Dynamic Open Graph meta tags for WhatsApp/Telegram sharing
  useEffect(() => {
    if (post) {
      const currentUrl = window.location.href;
      const imageUrl = post.featured_image || 'https://folhanewsbrasil.com.br/logo.png';
      
      // Smart fallback for description
      let description = post.meta_description || post.subtitle;
      if (!description && post.body) {
        // Extract first 150 chars from body, strip HTML tags
        const textContent = post.body.replace(/<[^>]*>/g, '').trim();
        description = textContent.substring(0, 150) + '...';
      }
      // Ensure max 200 chars
      if (description && description.length > 200) {
        description = description.substring(0, 197) + '...';
      }
      
      // Title with branding
      const ogTitle = `${post.title} | Folha News Brasil`;
      
      // Remove existing meta tags
      const existingTags = document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]');
      existingTags.forEach(tag => tag.remove());

      // Open Graph tags
      const metaTags = [
        { property: 'og:title', content: ogTitle },
        { property: 'og:description', content: description },
        { property: 'og:image', content: imageUrl },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:url', content: currentUrl },
        { property: 'og:type', content: 'article' },
        { property: 'og:site_name', content: 'Folha News Brasil' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: ogTitle },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: imageUrl },
      ];

      metaTags.forEach(tag => {
        const meta = document.createElement('meta');
        if (tag.property) meta.setAttribute('property', tag.property);
        if (tag.name) meta.setAttribute('name', tag.name);
        meta.setAttribute('content', tag.content);
        document.head.appendChild(meta);
      });

      // Update document title
      document.title = ogTitle;

      // Cleanup on unmount
      return () => {
        const tags = document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]');
        tags.forEach(tag => tag.remove());
      };
    }
  }, [post]);

  // Generate JSON-LD for SEO
  const jsonLd = post ? {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    "description": post.meta_description || post.subtitle,
    "image": post.featured_image,
    "datePublished": post.publish_date || post.created_date,
    "dateModified": post.updated_date || post.created_date,
    "author": {
      "@type": "Person",
      "name": post.author_name || "Redação Folha News Brasil"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Folha News Brasil",
      "logo": {
        "@type": "ImageObject",
        "url": "/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    }
  } : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <TopBar />
        <BrandingHeader />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-[#D71E1F]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <TopBar />
        <BrandingHeader />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-4">Notícia não encontrada</h1>
          <p className="text-gray-500 mb-8">A notícia que você procura não existe ou foi removida.</p>
          <a 
            href="/"
            className="inline-flex items-center gap-2 bg-[#D71E1F] hover:bg-[#b91c1c] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Voltar para Home
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD Script */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Header */}
      <TopBar />
      <BrandingHeader />

      {/* Main Article */}
      <main>
        <article>
          {/* Breadcrumb */}
          <ArticleBreadcrumb category={post.category} />

          {/* Article Header */}
          <ArticleHeader post={post} />

          {/* Featured Image */}
          <ArticleFeaturedImage 
            src={post.featured_image} 
            alt={post.title}
            caption={post.image_caption}
          />

          {/* Video Embed */}
          {post.video_url && (
            <div className="max-w-4xl mx-auto px-4 mb-8">
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src={post.video_url.replace('watch?v=', 'embed/')}
                  title={post.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* 2-Column Grid: Content Left + Sidebar Right */}
          <div className="max-w-[1200px] mx-auto px-4 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
              {/* Left Content (comes first in HTML for SEO) */}
              <div>
                <ArticleBody content={post.body} />
              </div>

              {/* Right Sidebar */}
              <div className="lg:block">
                <div className="sticky top-5">
                  <ArticleSidebar />
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <RelatedPosts posts={relatedPosts} currentPostId={post.id} />
      </main>

      {/* Floating WhatsApp */}
      <FloatingWhatsApp />

      {/* Footer */}
      <Footer />
    </div>
  );
}