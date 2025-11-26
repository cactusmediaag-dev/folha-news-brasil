import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, Clock, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

// WhatsApp icon component
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

function calculateReadingTime(text) {
  if (!text) return 1;
  const wordsPerMinute = 200;
  const wordCount = text.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes < 1 ? 1 : minutes;
}

export default function ArticleHeader({ post }) {
  const readingTime = calculateReadingTime(post.body);
  
  const shareOnWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post.title);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  return (
    <header className="max-w-[1140px] mx-auto px-4 py-10 sm:py-14">
      {/* Title - Elegant */}
      <h1 
        className="text-2xl sm:text-3xl lg:text-[2.5rem] font-bold leading-[1.2] mb-6"
        style={{ 
          fontFamily: "'Overpass', sans-serif",
          fontWeight: 700,
          letterSpacing: '-0.5px',
          color: '#1A202C'
        }}
      >
        {post.title}
      </h1>

      {/* Subtitle / Lead */}
      {post.subtitle && (
        <p 
          className="text-lg sm:text-xl lg:text-[1.3rem] leading-relaxed mb-8"
          style={{ color: '#4A5568' }}
        >
          {post.subtitle}
        </p>
      )}

      {/* Author & Date Info */}
      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm sm:text-base">
        {post.author_name && (
          <span className="font-semibold text-[#1A1A1A]">
            Por {post.author_name}
          </span>
        )}
        <time 
          dateTime={post.publish_date || post.created_date} 
          className="text-gray-500"
        >
          {format(new Date(post.publish_date || post.created_date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
        </time>
      </div>

      {/* Stats & Share Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-gray-200">
        {/* Stats Badges */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600">
            <Eye className="w-4 h-4" />
            {(post.views_count || 0).toLocaleString()} views
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            {readingTime} min de leitura
          </span>
        </div>

        {/* Social Share Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 mr-1">Compartilhar:</span>
          <Button
            variant="outline"
            size="icon"
            onClick={shareOnWhatsApp}
            className="w-9 h-9 rounded-full border-gray-300 hover:bg-green-500 hover:border-green-500 hover:text-white transition-all"
          >
            <WhatsAppIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={shareOnFacebook}
            className="w-9 h-9 rounded-full border-gray-300 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all"
          >
            <Facebook className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={shareOnTwitter}
            className="w-9 h-9 rounded-full border-gray-300 hover:bg-sky-500 hover:border-sky-500 hover:text-white transition-all"
          >
            <Twitter className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}