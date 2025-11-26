import React, { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
    image: "https://images.unsplash.com/photo-1574943320219-acbc608c6377?w=400&h=700&fit=crop",
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
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const openViewer = (index) => {
    setCurrentStoryIndex(index);
    setViewerOpen(true);
    setProgress(0);
    startProgress();
  };

  const closeViewer = () => {
    setViewerOpen(false);
    clearInterval(progressInterval.current);
  };

  const startProgress = () => {
    clearInterval(progressInterval.current);
    setProgress(0);
    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNextStory();
          return 0;
        }
        return prev + 2;
      });
    }, 100);
  };

  const goToNextStory = () => {
    if (currentStoryIndex < mockStories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      closeViewer();
    }
  };

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleTouchArea = (e, area) => {
    e.stopPropagation();
    if (area === "left") {
      goToPrevStory();
    } else {
      goToNextStory();
    }
  };

  return (
    <>
      <section className="py-8 bg-white" id="webstories">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A]">Web Stories</h2>
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
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <style>{`
                div::-webkit-scrollbar { display: none; }
              `}</style>
              {mockStories.map((story, index) => (
                <button
                  key={story.id}
                  onClick={() => openViewer(index)}
                  className="relative flex-shrink-0 w-[180px] sm:w-[200px] h-[320px] sm:h-[360px] rounded-2xl overflow-hidden group news-card-hover text-left"
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
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Story Viewer */}
      <AnimatePresence>
        {viewerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.9)' }}
            onClick={closeViewer}
          >
            {/* Close Button */}
            <button
              onClick={closeViewer}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Story Container - 9:16 aspect ratio */}
            <motion.div
              key={currentStoryIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-[400px] mx-4"
              style={{ aspectRatio: '9/16', maxHeight: '90vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress Bars */}
              <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
                {mockStories.map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full bg-white transition-all duration-100"
                      style={{
                        width: i < currentStoryIndex ? '100%' : i === currentStoryIndex ? `${progress}%` : '0%'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Story Image */}
              <img
                src={mockStories[currentStoryIndex].image}
                alt={mockStories[currentStoryIndex].title}
                className="w-full h-full object-cover rounded-xl"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 rounded-xl" />

              {/* Touch Areas */}
              <div className="absolute inset-0 flex rounded-xl overflow-hidden">
                <button
                  className="w-1/3 h-full cursor-pointer"
                  onClick={(e) => handleTouchArea(e, "left")}
                />
                <button
                  className="w-2/3 h-full cursor-pointer"
                  onClick={(e) => handleTouchArea(e, "right")}
                />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <Badge className="bg-[#D71E1F] text-white mb-3">
                  {mockStories[currentStoryIndex].category}
                </Badge>
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {mockStories[currentStoryIndex].title}
                </h2>
              </div>

              {/* Navigation Arrows */}
              {currentStoryIndex > 0 && (
                <button
                  onClick={(e) => handleTouchArea(e, "left")}
                  className="absolute left-[-50px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full items-center justify-center hidden sm:flex"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              )}
              {currentStoryIndex < mockStories.length - 1 && (
                <button
                  onClick={(e) => handleTouchArea(e, "right")}
                  className="absolute right-[-50px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full items-center justify-center hidden sm:flex"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}