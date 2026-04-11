# mri_Qfps

Um script avançado e otimizado para o FiveM que combina aprimoramento de FPS corporativo com um sistema inédito de Mira Customizada (Crosshair) via NUI.

## 🚀 Features Principais

### 1. FPS Boost & Otimização GFX
- **Presets Rápidos:** Opção de perfis (ex: `ulow`) que alteram nativamente a renderização pesada do GTA para otimizar ao máximo as taxas de quadros (FPS) para quem sofre com baixo desempenho.
- **Micro-Gerenciamento Visual:** Sliders para controlar ativamente a distância de carregamento (`LOD Distance`), corte de luzes (`Lights Cutoff`) e distâncias de sombras (`Shadows Cutoff`).
- **Persistência de Dados Lógica:** Salva os presets preferidos diretamente via `SetResourceKvp`, mantendo sua última configuração persistente sem depender de chamadas com o banco de dados do servidor.

### 2. Sistema de Mira Customizada (NUI Crosshair)
Uma evolução total comparada a velhos scripts de crosshair em tela. Desenvolvida do zero para PvP e máxima responsividade:
- **Zero Impacto:** A renderização da mira acontece puramente via CSS/React do lado NUI (Chromium).
- **Detecção Inteligente:** Possui uma thread LUA com temporizadores de descanso dinâmicos (Sleep dinâmico de 500ms -> 50ms -> 0ms). O script **hiberna** para quem não está mirando/armado, reduzindo o uso de CPU.
- **Supressão Otimizada vs Ghosting:** Previne a aparição ("flickering") da mira nativa do GTA V durante momentos de reações de tiro rápido (Quick-scope). 
- **Preview Flutuante em Tempo Real:** Conforme você mexe na interface gráfica, você assiste as configurações de sua mira atuando ao vivo em um quadro espelhado externamente ao lado da UI.
- **Customização Total de Geometria:** Modifique: Tamanho, Espessura, Abertura (Gap), Coração RGB, Opacidade nativa, e ative Contorno de foco.

## 💻 Tech Stack & Desenvolvimento
- Interface gráfica elaborada utilizando **React**, **TypeScript**, **Vite** no *front-end* (`ui/`).
- Integrado com os tokens visuais minimalistas e modernos da biblioteca `@mriqbox/ui-kit`.
- Animações escalonadas baseadas em provedores de visibilidade integrados nativamente com os hooks do LUA escape-keybind.

---
> **Aviso de Build:** Para alterações no painel, abra o terminal no diretório `/ui/` e execute o comando `pnpm run build`. Levante o script em ambiente de testes para sincronizar.
