import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ArticleSidebar() {
  // Fetch mix of recent posts from various categories
  const { data: mixPosts = [] } = useQuery({
    queryKey: ['sidebar-mix-posts'],
    queryFn: () => base44.entities.Post.filter({ status: 'published' }, '-created_date', 4),
  });

  return (
    <aside className="space-y-8">
      {/* Widget 1: Ads Placeholder */}
      <div 
        className="bg-[#F7FAFC] border border-dashed border-[#CBD5E0] rounded-lg flex items-center justify-center"
        style={{ width: '100%', maxWidth: '300px', height: '250px' }}
      >
        <span className="text-sm text-gray-400 font-medium">Publicidade</span>
      </div>

      {/* Widget 2: Da Redação */}
      <div className="w-full max-w-[300px]">
        {/* Header Premium */}
        <div 
          className="px-4 py-3 rounded-t-lg"
          style={{ background: 'linear-gradient(135deg, #232526 0%, #414345 100%)' }}
        >
          <h3 className="text-white font-bold text-sm tracking-wide uppercase">
            Da Redação
          </h3>
        </div>

        {/* News List */}
        <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg divide-y divide-gray-100">
          {mixPosts.map((post) => (
            <Link
              key={post.id}
              to={`${createPageUrl("Noticia")}?slug=${post.slug}`}
              className="flex gap-3 p-3 hover:bg-gray-50 transition-colors group"
            >
              {/* Thumbnail */}
              {post.featured_image && (
                <img
                  src={post.featured_image}
                  alt=""
                  className="w-16 h-16 object-cover rounded flex-shrink-0"
                  loading="lazy"
                />
              )}
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 
                  className="text-[15px] font-bold text-[#1A1A1A] leading-tight line-clamp-2 group-hover:text-[#D71E1F] transition-colors"
                  style={{ fontFamily: "'Overpass', sans-serif" }}
                >
                  {post.title}
                </h4>
                <span className="text-xs text-gray-400 mt-1 block">
                  {format(new Date(post.publish_date || post.created_date), "dd MMM", { locale: ptBR })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}