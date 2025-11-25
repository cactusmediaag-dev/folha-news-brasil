import React, { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const mockStories = [
  {
    id: 1,
    title: "Os bastidores da votação no Congresso",
    category: "Política",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=700&fit=crop",
  },
  {
    id: 2,
    title: "Como a tecnologia está mudando o agronegócio",
    category: "Economia",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=700&fit=crop",
  },
  {
    id: 3,
    title: "Os melhores gols da rodada do Brasileirão",
    category: "Esportes",
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&h=700&fit=crop",
  },
  {
    id: 4,
    title: "Novo smartphone revoluciona o mercado",
    category: "Tecnologia",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=700&fit=crop",
  },
  {
    id: 5,
    title: "Conflitos no Oriente Médio: entenda",
    category: "Mundo",
    image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400&h=700&fit=crop",
  },
  {
    id: 6,
    title: "Bitcoin atinge novo recorde histórico",
    category: "Criptos",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=700&fit=crop",
  },
];

export default function WebStoriesCarousel() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-8 bg-white" id="webstories">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Web Stories AMP</h2>
            <div className="w-20 h-1 bg-[#D71E1F] mt-2 rounded-full" />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="rounded-full border-gray-300 hover:border-[#D71E1F] hover:text-[#D71E1F]"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="rounded-full border-gray-300 hover:border-[#D71E1F] hover:text-[#D71E1F]"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Stories Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-4"
        >
          {mockStories.map((story) => (
            <a
              key={story.id}
              href={`#story-${story.id}`}
              className="relative flex-shrink-0 w-[180px] sm:w-[200px] h-[320px] sm:h-[360px] rounded-2xl overflow-hidden group news-card-hover"
            >
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 gradient-overlay" />
              
              {/* Play Icon */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <Badge className="w-fit bg-[#D71E1F] hover:bg-[#b91c1c] text-white text-xs mb-2">
                  {story.category}
                </Badge>
                <h3 className="text-sm font-bold text-white leading-tight line-clamp-3">
                  {story.title}
                </h3>
              </div>

              {/* Progress Bars (decorative) */}
              <div className="absolute top-2 left-2 right-2 flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
                  >
                    {i === 1 && <div className="w-full h-full bg-white" />}
                  </div>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}