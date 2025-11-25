import React from "react";
import { 
  Flag, 
  Star, 
  Cpu, 
  TrendingUp, 
  Globe, 
  Bitcoin, 
  Trophy 
} from "lucide-react";

const categories = [
  { name: "Brasil", icon: Flag, color: "bg-green-500" },
  { name: "Destaques", icon: Star, color: "bg-yellow-500" },
  { name: "Tecnologia", icon: Cpu, color: "bg-blue-500" },
  { name: "Economia", icon: TrendingUp, color: "bg-emerald-500" },
  { name: "Mundo", icon: Globe, color: "bg-purple-500" },
  { name: "Criptos", icon: Bitcoin, color: "bg-orange-500" },
  { name: "Esportes", icon: Trophy, color: "bg-red-500" },
];

export default function CategoryStories() {
  return (
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-start gap-4 sm:gap-8 overflow-x-auto hide-scrollbar pb-2">
          {categories.map((category) => (
            <a
              key={category.name}
              href={`#${category.name.toLowerCase()}`}
              className="flex flex-col items-center gap-2 min-w-fit group"
            >
              <div className="story-circle rounded-full p-[3px]">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${category.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <category.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#333333] group-hover:text-[#D71E1F] transition-colors">
                {category.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}