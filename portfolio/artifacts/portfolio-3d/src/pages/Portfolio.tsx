import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import Scene from "@/components/Scene";
import SectionContent from "@/components/SectionContent";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function Portfolio() {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const totalSections = 4;

  const handleNext = () => {
    setSectionIndex((prev) => (prev + 1) % totalSections);
  };

  const handlePrev = () => {
    setSectionIndex((prev) => (prev - 1 + totalSections) % totalSections);
  };

  // Rotate the model 90° per section, but offset so the original
  // "back of the mountain" pose lands on the About section (index 2),
  // not on the first (Experience) section. Negated so the island
  // spins in the opposite (clockwise from above) direction.
  const targetRotation = -(sectionIndex - 2) * (Math.PI / 2);

  const sections = ["EXPERIENCE", "PROJECTS", "ABOUT", "CONTACT"];

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#0b0616] text-white">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 2.5, 11], fov: 38 }} gl={{ toneMappingExposure: 1.2 }}>
          <Scene targetRotation={targetRotation} zoomedIn={detailOpen} />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 md:p-12">
        {/* Header */}
        <header className="flex justify-between items-start">
          <div className="font-display font-bold text-xl tracking-tight text-white mix-blend-difference pointer-events-auto">
            PARV NANGALIA
          </div>
          <div className="font-mono text-xs text-white/50 tracking-widest pointer-events-auto">
            0{sectionIndex + 1} / 0{totalSections} — {sections[sectionIndex]}
          </div>
        </header>

        {/* Main Content Area — text panel on the right, vertically centered slightly below mid */}
        <main className="flex-1 flex justify-end pointer-events-none pr-0 md:pr-4">
          <div className="w-full max-w-md pointer-events-auto self-center mt-[8vh] md:mt-[12vh]">
            <SectionContent
              index={sectionIndex}
              open={detailOpen}
              onOpenChange={setDetailOpen}
            />
          </div>
        </main>

        {/* Footer Navigation */}
        <footer className="flex flex-col items-center gap-6 pointer-events-auto">
          {sectionIndex === 0 && (
            <div className="text-white/40 text-sm animate-pulse">
              Click Next to explore
            </div>
          )}
          
          <div className="flex items-center gap-6 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl">
            <Button variant="ghost" size="icon" onClick={handlePrev} className="text-white hover:bg-white/10 hover:text-white rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex gap-3">
              {sections.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 rounded-full transition-all duration-500 ${i === sectionIndex ? 'w-8 bg-primary shadow-[0_0_10px_rgba(255,175,51,0.8)]' : 'w-2 bg-white/20'}`}
                />
              ))}
            </div>

            <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-[#2a1a05] rounded-full px-6 flex items-center gap-2 group shadow-[0_0_20px_rgba(255,175,51,0.45)] font-medium">
              Next
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </footer>
      </div>

      <Loader containerStyles={{ background: '#0b0616' }} innerStyles={{ width: '300px' }} barStyles={{ background: '#ffaf33', height: '4px' }} dataStyles={{ color: '#fff', fontFamily: 'Space Grotesk' }} />
    </div>
  );
}