import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ChevronLeft, ChevronRight, ChevronRight as ArrowRight, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function EntertainmentWorldSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch entertainment posts
  const { data: entertainmentPosts = [] } = useQuery({
    queryKey: ["entertainment-posts"],
    queryFn: () => base44.entities.Post.filter(
      { category: "entretenimento", status: "published" },
      "-publish_date",
      4
    ),
  });

  // Fetch world posts
  const { data: worldPosts = [] } = useQuery({
    queryKey: ["world-posts"],
    queryFn: () => base44.entities.Post.filter(
      { category: "mundo", status: "published" },
      "-publish_date",
      4
    ),
  });

  // Auto-slide
  useEffect(() => {
    if (entertainmentPosts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % entertainmentPosts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [entertainmentPosts.length]);

  const goToSlide = (index) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + entertainmentPosts.length) % entertainmentPosts.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % entertainmentPosts.length);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return format(new Date(dateStr), "dd MMM, HH:mm", { locale: ptBR });
    } catch {
      return "";
    }
  };

  return (
    <section className="mt-12 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-8">
        
        {/* Left Column - Entertainment Slider */}
        <div>
          {/* Header */}
          <div 
            className="flex items-center justify-between px-4 py-3 rounded-t-lg"
            style={{ background: "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)" }}
          >
            <h2 className="text-white font-bold text-lg uppercase tracking-wide">
              Entretenimento
            </h2>
            <Link 
              to={createPageUrl("Categoria") + "?slug=entretenimento"}
              className="text-white text-sm font-semibold flex items-center gap-1 hover:underline"
            >
              Ver mais <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Slider */}
          <div className="relative h-[400px] overflow-hidden rounded-b-lg bg-gray-900">
            {entertainmentPosts.length > 0 ? (
              <>
                {entertainmentPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    to={createPageUrl("Noticia") + `?slug=${post.slug}`}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  >
                    <img
                      src={post.featured_image || "https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=800"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span 
                        className="inline-block px-3 py-1 text-xs font-bold text-white rounded mb-3 uppercase"
                        style={{ background: "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)" }}
                      >
                        Entretenimento
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight line-clamp-3">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                ))}

                {/* Navigation Arrows */}
                <button
                  onClick={(e) => { e.preventDefault(); prevSlide(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); nextSlide(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {entertainmentPosts.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => { e.preventDefault(); goToSlide(index); }}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        index === currentSlide 
                          ? "bg-white w-6" 
                          : "bg-white/50 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Carregando...
              </div>
            )}
          </div>
        </div>

        {/* Right Column - World News List */}
        <div className="flex flex-col">
          {/* Header */}
          <div 
            className="flex items-center justify-between px-4 py-3 rounded-t-lg"
            style={{ background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" }}
          >
            <h2 className="text-white font-bold text-lg uppercase tracking-wide">
              Mundo
            </h2>
            <Link 
              to={createPageUrl("Categoria") + "?slug=mundo"}
              className="text-white text-sm font-semibold flex items-center gap-1 hover:underline"
            >
              Ver mais <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* News List */}
          <div 
            className="bg-white border border-t-0 border-gray-200 rounded-b-lg flex-1 flex flex-col justify-between"
            style={{ minHeight: "400px" }}
          >
            {worldPosts.length > 0 ? (
              <div className="flex flex-col h-full">
                {worldPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    to={createPageUrl("Noticia") + `?slug=${post.slug}`}
                    className={`group flex-1 px-4 py-5 flex flex-col justify-center ${
                      index < worldPosts.length - 1 ? "border-b border-dashed border-gray-300" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(post.publish_date || post.created_date)}</span>
                    </div>
                    <h4 
                      className="text-[15px] font-semibold text-[#1A1A1A] leading-snug line-clamp-2 group-hover:text-[#1e3c72] transition-colors"
                      style={{ fontFamily: "'Overpass', sans-serif" }}
                    >
                      {post.title}
                    </h4>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Carregando...
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}