import { useState } from 'react';
import { fetchNui } from './utils/fetchNui';
import { MriCard, MriCardHeader, MriCardTitle, MriCardDescription, MriCardContent } from '@mriqbox/ui-kit';
import { useVisibility } from './providers/VisibilityProvider';

export default function App() {
  const { setVisible } = useVisibility();
  const [lodDistance, setLodDistance] = useState(1.0);
  const [lightsCutoff, setLightsCutoff] = useState(1.0);
  const [shadowsCutoff, setShadowsCutoff] = useState(1.0);
  const [activePreset, setActivePreset] = useState('default');
  
  const handlePreset = (preset: string) => {
    setActivePreset(preset);
    fetchNui('setPresetFps', { preset });
    
    switch (preset) {
      case 'default':
        setLodDistance(1.0);
        setLightsCutoff(1.0);
        setShadowsCutoff(1.0);
        break;
      case 'medium':
        setLodDistance(0.8);
        setLightsCutoff(0.8);
        setShadowsCutoff(0.8);
        break;
      case 'low':
        setLodDistance(0.5);
        setLightsCutoff(0.5);
        setShadowsCutoff(0.5);
        break;
      case 'ulow':
        setLodDistance(0.1);
        setLightsCutoff(0.0);
        setShadowsCutoff(0.0);
        break;
    }
  };

  const handleApplySliders = () => {
    fetchNui('setSliders', { lodDistance, lightsCutoff, shadowsCutoff });
  };

  const handleResetSliders = () => {
    setLodDistance(1.0);
    setLightsCutoff(1.0);
    setShadowsCutoff(1.0);
    setActivePreset('default');
    fetchNui('setSliders', { lodDistance: 1.0, lightsCutoff: 1.0, shadowsCutoff: 1.0 });
    fetchNui('setPresetFps', { preset: 'default' });
  };

  const closeMenu = () => {
    setVisible(false);
  };

  return (
    <div className="flex h-screen w-full p-4 relative font-sans text-white">
      {/* Background overlay to close menu */}
      <div className="absolute inset-0 bg-transparent" onClick={closeMenu}></div>

      {/* Main Card Element fixed to the right side */}
      <MriCard className="absolute right-8 top-1/2 -translate-y-1/2 w-[420px] z-10 bg-[#141414] border border-[#222222] shadow-2xl rounded-2xl overflow-hidden">
        
        {/* Header */}
        <MriCardHeader className="bg-[#1C1C1C] p-6 border-b border-[#222222] flex flex-row justify-between items-start pb-5">
          <div className="space-y-1">
            <MriCardTitle className="text-xl font-bold flex items-center gap-2">
              <span className="text-[#00E576]">MRI</span> FPS Boost
            </MriCardTitle>
            <MriCardDescription className="text-neutral-400 text-[13px] font-medium">
              Otimize o jogo para o seu computador
            </MriCardDescription>
          </div>
          <button 
            onClick={closeMenu} 
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#333333] hover:bg-[#2A2A2A] text-neutral-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </MriCardHeader>
        
        {/* Content */}
        <MriCardContent className="p-6">
          
          {/* Presets Section */}
          <div className="space-y-4 mb-8">
            <h2 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest pl-1">Ajuste Rápido (Presets)</h2>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handlePreset('default')} 
                className={`h-[68px] flex flex-col items-center justify-center rounded-xl transition-all ${
                  activePreset === 'default' 
                  ? 'bg-[#00E576] text-black font-bold' 
                  : 'bg-[#121212] border border-[#222222] text-white hover:border-[#444444]'
                }`}
              >
                <span className="text-sm font-bold">Padrão</span>
                <span className={`text-[10px] mt-1 ${activePreset === 'default' ? 'text-black/70' : 'text-neutral-400'}`}>PC Gamer</span>
              </button>
              
              <button 
                onClick={() => handlePreset('medium')} 
                className={`h-[68px] flex flex-col items-center justify-center rounded-xl transition-all ${
                  activePreset === 'medium' 
                  ? 'bg-[#00E576] text-black font-bold' 
                  : 'bg-[#0A0A0A] border border-[#222222] text-white hover:border-[#444444]'
                }`}
              >
                <span className="text-sm font-bold">Médio</span>
                <span className={`text-[10px] mt-1 ${activePreset === 'medium' ? 'text-black/70' : 'text-neutral-400'}`}>PC Mediano</span>
              </button>
              
              <button 
                onClick={() => handlePreset('low')} 
                className={`h-[68px] flex flex-col items-center justify-center rounded-xl transition-all ${
                  activePreset === 'low' 
                  ? 'bg-[#00E576] text-black font-bold' 
                  : 'bg-[#0A0A0A] border border-[#222222] text-white hover:border-[#444444]'
                }`}
              >
                <span className="text-sm font-bold">Baixo</span>
                <span className={`text-[10px] mt-1 ${activePreset === 'low' ? 'text-black/70' : 'text-neutral-400'}`}>PC Fraco</span>
              </button>
              
              <button 
                onClick={() => handlePreset('ulow')} 
                className={`h-[68px] flex flex-col items-center justify-center rounded-xl transition-all ${
                  activePreset === 'ulow' 
                  ? 'bg-[#00E576] text-black border-transparent font-bold' 
                  : 'bg-[#0A0A0A] border border-[#00E576]/30 text-[#00E576] hover:bg-[#00E576]/10'
                }`}
              >
                <span className="text-sm font-bold">Ultra Low</span>
                <span className={`text-[10px] mt-1 ${activePreset === 'ulow' ? 'text-black/70 font-medium' : 'text-[#00E576]/70'}`}>Batata-Gamer</span>
              </button>
            </div>
          </div>
          
          {/* Separator */}
          <div className="h-[1px] w-full bg-[#222222] mb-8"></div>
          
          {/* Sliders Section */}
          <div className="space-y-6 mb-8">
            <div className="flex justify-between items-center pl-1 mb-2">
              <h2 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Ajuste Fino</h2>
              <button 
                onClick={handleResetSliders} 
                className="text-xs text-neutral-400 hover:text-white transition-colors"
              >
                Resetar
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-200">Distância de Renderização</span>
                <span className="font-mono text-[#00E576] font-bold bg-[#1A1A1A] px-2 py-0.5 rounded text-xs">{lodDistance.toFixed(1)}</span>
              </div>
              <input 
                type="range" 
                min="0.1" max="10" step="0.1" 
                value={lodDistance} 
                onChange={(e) => setLodDistance(Number(e.target.value))} 
                className="w-full h-1.5 bg-[#2A2A2A] rounded-lg appearance-none cursor-pointer accent-[#00E576]" 
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-200">Luzes Distantes</span>
                <span className="font-mono text-[#00E576] font-bold bg-[#1A1A1A] px-2 py-0.5 rounded text-xs">{lightsCutoff.toFixed(1)}</span>
              </div>
              <input 
                type="range" 
                min="0" max="10" step="0.1" 
                value={lightsCutoff} 
                onChange={(e) => setLightsCutoff(Number(e.target.value))} 
                className="w-full h-1.5 bg-[#2A2A2A] rounded-lg appearance-none cursor-pointer accent-[#00E576]" 
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-200">Sombras</span>
                <span className="font-mono text-[#00E576] font-bold bg-[#1A1A1A] px-2 py-0.5 rounded text-xs">{shadowsCutoff.toFixed(1)}</span>
              </div>
              <input 
                type="range" 
                min="0" max="5" step="0.1" 
                value={shadowsCutoff} 
                onChange={(e) => setShadowsCutoff(Number(e.target.value))} 
                className="w-full h-1.5 bg-[#2A2A2A] rounded-lg appearance-none cursor-pointer accent-[#00E576]" 
              />
            </div>
          </div>
          
          {/* Apply Button */}
          <button 
            onClick={handleApplySliders}
            className="w-full h-14 bg-[#00E576] hover:bg-[#00E576]/90 text-black font-bold text-sm tracking-widest rounded-xl transition-all"
          >
            APLICAR AJUSTES
          </button>
        </MriCardContent>
      </MriCard>
    </div>
  );
}
