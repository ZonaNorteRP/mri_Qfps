import { useState, useEffect } from 'react';
import { fetchNui } from './utils/fetchNui';
import { useNuiEvent } from './utils/useNuiEvent';
import { MriCard, MriCardHeader, MriCardTitle, MriCardDescription, MriCardContent } from '@mriqbox/ui-kit';
import { useVisibility } from './providers/VisibilityProvider';
import { Zap, Palette, Crosshair, X } from 'lucide-react';

type Tab = 'fps' | 'gfx' | 'crosshair';

interface CrosshairSettings {
  enabled: boolean;
  size: number;
  thickness: number;
  gap: number;
  dot: boolean;
  color_r: number;
  color_g: number;
  color_b: number;
  alpha: number;
  outline: boolean;
  outlineThickness: number;
  style: number;
}

const DEFAULT_CROSSHAIR: CrosshairSettings = {
  enabled: false,
  size: 5,
  thickness: 1,
  gap: 0,
  dot: false,
  color_r: 50,
  color_g: 250,
  color_b: 50,
  alpha: 200,
  outline: false,
  outlineThickness: 1,
  style: 4,
};

const CROSSHAIR_PRESETS: { name: string; desc: string; settings: Partial<CrosshairSettings> }[] = [
  {
    name: 'Dot',
    desc: 'Ponto central',
    settings: { enabled: true, size: 1, thickness: 1, gap: -5, dot: false, color_r: 255, color_g: 255, color_b: 255, alpha: 255, outline: false, outlineThickness: 0, style: 4 },
  },
  {
    name: 'Cruz Fechada',
    desc: 'Competitivo',
    settings: { enabled: true, size: 1, thickness: 1, gap: -9, dot: false, color_r: 0, color_g: 255, color_b: 0, alpha: 255, outline: true, outlineThickness: 0.8, style: 4 },
  },
  {
    name: 'Cruz Aberta',
    desc: 'Clássico',
    settings: { enabled: true, size: 2.5, thickness: 2, gap: -8, dot: false, color_r: 255, color_g: 255, color_b: 255, alpha: 255, outline: false, outlineThickness: 0, style: 4 },
  },
  {
    name: 'Nenhuma',
    desc: 'Mira padrão GTA',
    settings: { enabled: false },
  },
];

const TIMECYCLES = [
  { id: 'default', name: 'Padrão', desc: 'Gráficos padrão do jogo', extra: null },
  { id: 'cinema', name: 'Cinema', desc: 'Filtro cinematográfico', extra: null },
  { id: 'yell_tunnel_nodirect', name: 'Opção #2', desc: 'Tom dourado/amarelado', extra: null },
  { id: 'tunnel', name: 'Opção #3', desc: 'Estilo túnel', extra: null },
  { id: 'MP_Powerplay_blend', name: 'Opção #4', desc: 'Powerplay', extra: 'reflection_correct_ambient' },
];

const PRESET_COLORS = [
  { name: 'Verde', r: 0, g: 250, b: 50 },
  { name: 'Branco', r: 255, g: 255, b: 255 },
  { name: 'Vermelho', r: 255, g: 50, b: 50 },
  { name: 'Amarelo', r: 255, g: 255, b: 50 },
  { name: 'Ciano', r: 50, g: 255, b: 255 },
  { name: 'Rosa', r: 255, g: 100, b: 200 },
];

/* ─── Crosshair SVG Preview ─── */
function CrosshairPreview({ settings, size = 120 }: { settings: CrosshairSettings; size?: number }) {
  if (!settings.enabled) {
    return (
      <div className="crosshair-preview" style={{ width: size, height: size }}>
        <span className="text-neutral-500 text-xs">OFF</span>
      </div>
    );
  }

  const cx = size / 2;
  const cy = size / 2;
  const color = `rgb(${settings.color_r}, ${settings.color_g}, ${settings.color_b})`;
  const opacity = settings.alpha / 255;
  const scale = 3;

  const lineLen = settings.size * scale;
  const thick = Math.max(settings.thickness * scale * 0.6, 0.5);
  const rawGap = settings.gap * scale * 0.5;
  const gapDist = rawGap < 0 ? Math.max(0, thick / 2 + rawGap) : thick / 2 + rawGap;
  const outlineT = settings.outline ? settings.outlineThickness * scale * 0.5 : 0;

  const lines = [
    { x: cx, y: cy - gapDist, dx: 0, dy: -lineLen },
    { x: cx, y: cy + gapDist, dx: 0, dy: lineLen },
    { x: cx - gapDist, y: cy, dx: -lineLen, dy: 0 },
    { x: cx + gapDist, y: cy, dx: lineLen, dy: 0 },
  ];

  return (
    <div className="crosshair-preview" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid background */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width={size} height={size} fill="url(#grid)" />

        {/* Outline layer */}
        {outlineT > 0 && lines.map((l, i) => (
          <line key={`o${i}`} x1={l.x} y1={l.y} x2={l.x + l.dx} y2={l.y + l.dy}
            stroke="black" strokeWidth={thick + outlineT * 2} opacity={opacity} strokeLinecap="butt" />
        ))}
        {outlineT > 0 && settings.dot && (
          <circle cx={cx} cy={cy} r={thick / 2 + outlineT} fill="black" opacity={opacity} />
        )}

        {/* Main lines */}
        {lines.map((l, i) => (
          <line key={`l${i}`} x1={l.x} y1={l.y} x2={l.x + l.dx} y2={l.y + l.dy}
            stroke={color} strokeWidth={thick} opacity={opacity} strokeLinecap="butt" />
        ))}

        {/* Dot */}
        {settings.dot && (
          <circle cx={cx} cy={cy} r={thick / 2 + 0.5} fill={color} opacity={opacity} />
        )}
      </svg>
    </div>
  );
}

/* ─── Slider Component ─── */
function Slider({ label, value, min, max, step, onChange, unit }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; unit?: string;
}) {
  return (
    <div className="slider-row">
      <div className="slider-header">
        <span className="slider-label">{label}</span>
        <span className="slider-value">{typeof value === 'number' ? (Number.isInteger(step) ? value : value.toFixed(1)) : value}{unit || ''}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} className="custom-range" />
    </div>
  );
}

/* ─── Main App ─── */
export default function App() {
  const { setVisible } = useVisibility();
  const [activeTab, setActiveTab] = useState<Tab>('fps');

  // FPS state
  const [lodDistance, setLodDistance] = useState(1.0);
  const [lightsCutoff, setLightsCutoff] = useState(1.0);
  const [shadowsCutoff, setShadowsCutoff] = useState(1.0);
  const [activePreset, setActivePreset] = useState('default');

  // GFX state
  const [activeTimecycle, setActiveTimecycle] = useState('default');

  // Crosshair state
  const [crosshair, setCrosshair] = useState<CrosshairSettings>({ ...DEFAULT_CROSSHAIR });

  // Receive initial state from client
  useNuiEvent<{
    preset?: string; lodDistance?: number; lightsCutoff?: number; shadowsCutoff?: number;
    timecycle?: string; crosshair?: CrosshairSettings;
  }>('initState', (data) => {
    if (data.preset) setActivePreset(data.preset);
    if (data.lodDistance !== undefined) setLodDistance(data.lodDistance);
    if (data.lightsCutoff !== undefined) setLightsCutoff(data.lightsCutoff);
    if (data.shadowsCutoff !== undefined) setShadowsCutoff(data.shadowsCutoff);
    if (data.timecycle) setActiveTimecycle(data.timecycle);
    if (data.crosshair) setCrosshair(data.crosshair);
  });

  // ─── FPS Handlers ───
  const handlePreset = (preset: string) => {
    setActivePreset(preset);
    fetchNui('setPresetFps', { preset });
    switch (preset) {
      case 'default': setLodDistance(1.0); setLightsCutoff(1.0); setShadowsCutoff(1.0); break;
      case 'medium': setLodDistance(0.8); setLightsCutoff(0.8); setShadowsCutoff(0.8); break;
      case 'low': setLodDistance(0.5); setLightsCutoff(0.5); setShadowsCutoff(0.5); break;
      case 'ulow': setLodDistance(0.1); setLightsCutoff(0.0); setShadowsCutoff(0.0); break;
    }
  };

  const handleApplySliders = () => {
    fetchNui('setSliders', { lodDistance, lightsCutoff, shadowsCutoff });
  };

  const handleResetSliders = () => {
    setLodDistance(1.0); setLightsCutoff(1.0); setShadowsCutoff(1.0);
    setActivePreset('default');
    fetchNui('setSliders', { lodDistance: 1.0, lightsCutoff: 1.0, shadowsCutoff: 1.0 });
    fetchNui('setPresetFps', { preset: 'default' });
  };

  // ─── GFX Handlers ───
  const handleTimecycle = (cycle: string, extra: string | null) => {
    setActiveTimecycle(cycle);
    fetchNui('setTimecycle', { cycle, extra });
  };

  // ─── Crosshair Handlers ───
  const updateCrosshair = (partial: Partial<CrosshairSettings>) => {
    setCrosshair(prev => ({ ...prev, ...partial }));
  };

  // Auto-apply crosshair on change with debounce
  useEffect(() => {
    const t = setTimeout(() => {
      fetchNui('setCrosshair', crosshair);
    }, 150);
    return () => clearTimeout(t);
  }, [crosshair]);

  const resetCrosshair = () => {
    setCrosshair({ ...DEFAULT_CROSSHAIR });
    fetchNui('resetCrosshair', {});
  };

  const applyPresetCrosshair = (preset: typeof CROSSHAIR_PRESETS[number]) => {
    const newSettings = { ...DEFAULT_CROSSHAIR, ...preset.settings };
    setCrosshair(newSettings);
  };

  const closeMenu = () => setVisible(false);

  const TABS: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'fps', icon: <Zap size={14} />, label: 'FPS' },
    { id: 'gfx', icon: <Palette size={14} />, label: 'GFX' },
    { id: 'crosshair', icon: <Crosshair size={14} />, label: 'Mira' },
  ];

  return (
    <div className="app-root">
      <div className="app-backdrop" onClick={closeMenu}></div>

      <MriCard className="app-card">
        {/* Header */}
        <MriCardHeader className="app-header">
          <div className="header-info">
            <MriCardTitle className="header-title">
              <span className="accent">MRI</span> FPS Boost
            </MriCardTitle>
            <MriCardDescription className="header-desc">
              Otimize o jogo para o seu computador
            </MriCardDescription>
          </div>
          <button onClick={closeMenu} className="close-btn"><X size={14} /></button>
        </MriCardHeader>

        {/* Tabs */}
        <div className="tabs-bar">
          {TABS.map(tab => (
            <button key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <MriCardContent className="app-content">

          {/* ═══ FPS TAB ═══ */}
          {activeTab === 'fps' && (
            <div className="tab-panel">
              <div className="section">
                <h2 className="section-title">Ajuste Rápido (Presets)</h2>
                <div className="preset-grid">
                  {[
                    { id: 'default', name: 'Padrão', desc: 'PC Gamer' },
                    { id: 'medium', name: 'Médio', desc: 'PC Mediano' },
                    { id: 'low', name: 'Baixo', desc: 'PC Fraco' },
                    { id: 'ulow', name: 'Ultra Low', desc: 'Batata-Gamer' },
                  ].map(p => (
                    <button key={p.id} onClick={() => handlePreset(p.id)}
                      className={`preset-btn ${activePreset === p.id ? 'active' : ''} ${p.id === 'ulow' ? 'ulow' : ''}`}
                    >
                      <span className="preset-name">{p.name}</span>
                      <span className="preset-desc">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="divider"></div>

              <div className="section">
                <div className="section-header">
                  <h2 className="section-title">Ajuste Fino</h2>
                  <button onClick={handleResetSliders} className="link-btn">Resetar</button>
                </div>
                <Slider label="Distância de Renderização" value={lodDistance} min={0.1} max={10} step={0.1} onChange={setLodDistance} />
                <Slider label="Luzes Distantes" value={lightsCutoff} min={0} max={10} step={0.1} onChange={setLightsCutoff} />
                <Slider label="Sombras" value={shadowsCutoff} min={0} max={5} step={0.1} onChange={setShadowsCutoff} />
              </div>

              <button onClick={handleApplySliders} className="apply-btn">APLICAR AJUSTES</button>
            </div>
          )}

          {/* ═══ GFX TAB ═══ */}
          {activeTab === 'gfx' && (
            <div className="tab-panel">
              <div className="section">
                <h2 className="section-title">Filtro Gráfico (Timecycle)</h2>
                <p className="section-desc">Escolha um filtro de pós-processamento visual</p>
                <div className="gfx-list">
                  {TIMECYCLES.map(tc => (
                    <button key={tc.id}
                      onClick={() => handleTimecycle(tc.id, tc.extra)}
                      className={`gfx-item ${activeTimecycle === tc.id ? 'active' : ''}`}
                    >
                      <div className="gfx-info">
                        <span className="gfx-name">{tc.name}</span>
                        <span className="gfx-desc">{tc.desc}</span>
                      </div>
                      {activeTimecycle === tc.id && <span className="gfx-check">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ CROSSHAIR TAB ═══ */}
          {activeTab === 'crosshair' && (
            <div className="tab-panel crosshair-panel">
              {crosshair.enabled ? (
                <>
                  {/* Presets */}
                  <div className="section">
                    <h2 className="section-title">Presets Rápidos</h2>
                    <div className="crosshair-presets">
                      {CROSSHAIR_PRESETS.filter(p => p.settings.enabled !== false).map((p, i) => (
                        <button key={i} onClick={() => applyPresetCrosshair(p)} className="crosshair-preset-btn">
                          <CrosshairPreview settings={{ ...DEFAULT_CROSSHAIR, ...p.settings } as CrosshairSettings} size={40} />
                          <span className="preset-mini-name">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="divider"></div>

                  {/* Geometry */}
                  <div className="section">
                    <h2 className="section-title">Geometria e Forma</h2>
                    <Slider label="Tamanho" value={crosshair.size} min={0.5} max={10} step={0.5} onChange={(v) => updateCrosshair({ size: v })} />
                    <Slider label="Espessura" value={crosshair.thickness} min={0.5} max={5} step={0.5} onChange={(v) => updateCrosshair({ thickness: v })} />
                    <Slider label="Abertura (Gap)" value={crosshair.gap} min={-10} max={10} step={1} onChange={(v) => updateCrosshair({ gap: v })} />
                    <div className="toggle-row">
                      <span>Ponto Central</span>
                      <button onClick={() => updateCrosshair({ dot: !crosshair.dot })}
                        className={`toggle-switch ${crosshair.dot ? 'on' : ''}`}>
                        <span className="toggle-knob"></span>
                      </button>
                    </div>
                  </div>

                  <div className="divider"></div>

                  {/* Color */}
                  <div className="section">
                    <h2 className="section-title">Coração RGB</h2>
                    <div className="color-presets">
                      {PRESET_COLORS.map((c, i) => (
                        <button key={i}
                          onClick={() => updateCrosshair({ color_r: c.r, color_g: c.g, color_b: c.b })}
                          className={`color-swatch ${crosshair.color_r === c.r && crosshair.color_g === c.g && crosshair.color_b === c.b ? 'active' : ''}`}
                          style={{ backgroundColor: `rgb(${c.r},${c.g},${c.b})` }}
                          title={c.name}
                        ></button>
                      ))}
                    </div>
                    <Slider label="Red" value={crosshair.color_r} min={0} max={255} step={1} onChange={(v) => updateCrosshair({ color_r: v })} />
                    <Slider label="Green" value={crosshair.color_g} min={0} max={255} step={1} onChange={(v) => updateCrosshair({ color_g: v })} />
                    <Slider label="Blue" value={crosshair.color_b} min={0} max={255} step={1} onChange={(v) => updateCrosshair({ color_b: v })} />
                  </div>

                  <div className="divider"></div>

                  {/* Visibility */}
                  <div className="section">
                    <h2 className="section-title">Opacidade & Contorno</h2>
                    <Slider label="Opacidade" value={crosshair.alpha} min={0} max={255} step={5} onChange={(v) => updateCrosshair({ alpha: v })} />
                    <div className="toggle-row">
                      <span>Contorno Preto</span>
                      <button onClick={() => updateCrosshair({ outline: !crosshair.outline })}
                        className={`toggle-switch ${crosshair.outline ? 'on' : ''}`}>
                        <span className="toggle-knob"></span>
                      </button>
                    </div>
                    {crosshair.outline && (
                      <Slider label="Espessura do Contorno" value={crosshair.outlineThickness} min={0.5} max={3} step={0.5} onChange={(v) => updateCrosshair({ outlineThickness: v })} />
                    )}
                  </div>

                  <button onClick={resetCrosshair} className="reset-crosshair-btn">RESETAR MIRA PARA O PADRÃO</button>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  A mira customizada está desativada.
                </div>
              )}
            </div>
          )}

        </MriCardContent>

        {/* External Float Preview */}
        {activeTab === 'crosshair' && (
          <div className="crosshair-external-preview">
            <div className="crosshair-external-box">
              <span className="crosshair-external-title">Visualização</span>
              <CrosshairPreview settings={crosshair} size={220} />
              <div className="crosshair-toggle-row" style={{ marginTop: '1rem' }}>
                <span className="crosshair-toggle-label">Mira Customizada</span>
                <button
                  onClick={() => updateCrosshair({ enabled: !crosshair.enabled })}
                  className={`toggle-switch ${crosshair.enabled ? 'on' : ''}`}
                >
                  <span className="toggle-knob"></span>
                </button>
              </div>
            </div>
          </div>
        )}
      </MriCard>
    </div>
  );
}
