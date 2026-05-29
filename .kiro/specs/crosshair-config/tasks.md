# Plano de Implementação: Crosshair Config

## Visão Geral

Implementação incremental da feature de configuração de mira customizada no menu `/fps` do recurso `mri_Qfps`. A implementação segue a arquitetura definida no design: componentes React/TypeScript na NUI e callbacks Lua no client-side, com persistência via ResourceKvp.

## Tasks

- [x] 1. Criar tipos, constantes e estrutura de arquivos base
  - Criar o diretório `ui/src/components/crosshair/`
  - Criar `types.ts` com as interfaces `CrosshairConfig`, `CrosshairColor` e o tipo `CrosshairStyle`
  - Criar `constants.ts` com `DEFAULT_CONFIG` e `PRESET_COLORS`
  - _Requisitos: 1.3, 2.1, 3.1, 4.1_

- [x] 2. Implementar o componente `CrosshairOverlay`
  - [x] 2.1 Criar `CrosshairOverlay.tsx` com posicionamento fixo no centro da tela
    - Implementar os três estilos visuais: `dot`, `cross` e `circle` via CSS
    - Aplicar cor via propriedade CSS `backgroundColor` / `borderColor` com os valores RGBA
    - Aplicar tamanho via `width` e `height` em pixels
    - Ocultar o overlay quando `enabled = false`
    - Adicionar `data-testid="crosshair-overlay"` e `data-style={style}` para testes
    - _Requisitos: 4.1, 7.3, 7.4_

  - [ ]* 2.2 Escrever teste de propriedade para o `CrosshairOverlay` (Propriedade 9)
    - **Propriedade 9: Toggle do overlay**
    - **Valida: Requisitos 7.3, 7.4**

- [x] 3. Implementar o componente `CrosshairPreview`
  - [x] 3.1 Criar `CrosshairPreview.tsx` com fundo escuro (`#1A1A1A`) e `CrosshairOverlay` em modo miniatura
    - Usar `preview={true}` no `CrosshairOverlay` para renderizar sem `position: fixed`
    - _Requisitos: 6.1, 6.3_

  - [ ]* 3.2 Escrever teste de propriedade para o `CrosshairPreview` (Propriedade 5)
    - **Propriedade 5: Preview reativo a qualquer mudança de config**
    - **Valida: Requisitos 3.2, 4.2, 6.2**

- [x] 4. Implementar os componentes de seleção (`ColorPicker`, `SizeSlider`, `StylePicker`, `EnableToggle`)
  - [x] 4.1 Criar `ColorPicker.tsx` com grid de swatches usando `PRESET_COLORS`
    - Destacar a cor ativa com classe CSS de destaque (ex: `ring-2`)
    - Ao clicar em uma cor, chamar `onChange` com o objeto `CrosshairColor` correspondente
    - _Requisitos: 2.1, 2.5_

  - [ ]* 4.2 Escrever teste de propriedade para o `ColorPicker` (Propriedade 2)
    - **Propriedade 2: Seleção ativa é destacada visualmente**
    - **Valida: Requisitos 2.5, 4.5**

  - [ ]* 4.3 Escrever teste de propriedade para o `ColorPicker` (Propriedade 3)
    - **Propriedade 3: Callback de cor carrega os valores RGBA corretos**
    - **Valida: Requisitos 2.2**

  - [x] 4.4 Criar `SizeSlider.tsx` com `<input type="range" min={4} max={32} step={1}>`
    - Exibir o valor atual em pixels ao lado do slider
    - Chamar `onChange` a cada mudança de valor
    - _Requisitos: 3.1, 3.2_

  - [x] 4.5 Criar `StylePicker.tsx` com 3 opções visuais: `dot`, `cross`, `circle`
    - Destacar o estilo ativo visualmente
    - Chamar `onChange` ao selecionar um estilo
    - _Requisitos: 4.1, 4.5_

  - [x] 4.6 Criar `EnableToggle.tsx` com checkbox estilizado ou switch
    - Chamar `onChange` ao alternar o estado
    - _Requisitos: 7.1_

- [x] 5. Implementar o componente container `CrosshairSection`
  - [x] 5.1 Criar `CrosshairSection.tsx` integrando todos os sub-componentes
    - Gerenciar estado `appliedConfig` e `pendingConfig` com `useState`
    - Escutar a mensagem NUI `loadCrosshairConfig` via `useNuiEvent` e atualizar ambos os estados
    - Ao selecionar cor: chamar `fetchNui('setCrosshairColor', color)` imediatamente e atualizar `appliedConfig`
    - Ao mover slider ou selecionar estilo: atualizar apenas `pendingConfig` (preview em tempo real)
    - Ao clicar "Aplicar Mira": chamar `fetchNui('setCrosshairConfig', { size, style })` com os valores de `pendingConfig`
    - Ao alternar o toggle: chamar `fetchNui('setCrosshairEnabled', { enabled })`
    - _Requisitos: 1.1, 2.2, 3.3, 4.3, 6.2, 7.2_

  - [ ]* 5.2 Escrever teste de propriedade para o `CrosshairSection` (Propriedade 1)
    - **Propriedade 1: Carregamento reflete configuração salva**
    - **Valida: Requisitos 1.2**

  - [ ]* 5.3 Escrever teste de propriedade para o `CrosshairSection` (Propriedade 6)
    - **Propriedade 6: Aplicar config dispara callback com valores corretos**
    - **Valida: Requisitos 3.3, 4.3**

- [x] 6. Integrar `CrosshairSection` e `CrosshairOverlay` no `App.tsx`
  - Adicionar `<CrosshairSection>` dentro da área do menu `/fps`, em seção separada das demais
  - Adicionar `<CrosshairOverlay>` fora do menu, renderizado diretamente no `App.tsx` para exibição persistente
  - Passar a `appliedConfig` para o `CrosshairOverlay` via estado elevado ou contexto
  - _Requisitos: 1.1, 7.3, 7.4_

- [x] 7. Checkpoint — Verificar se todos os testes do front-end passam
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

- [x] 8. Implementar os NUI Callbacks no Lua client-side
  - [x] 8.1 Criar a função `loadCrosshairConfig()` em `client/main.lua`
    - Ler as quatro chaves KVP com fallback para os valores padrão
    - Tratar JSON corrompido na chave de cor com `pcall` / fallback para branco
    - Chamar `SetCrosshairColour(r, g, b, a)` com a cor carregada
    - Enviar `SendNUIMessage({ action = 'loadCrosshairConfig', data = config })` para a NUI
    - _Requisitos: 1.2, 1.3, 5.2, 5.3_

  - [x] 8.2 Registrar o callback `setCrosshairColor` em `client/main.lua`
    - Chamar `SetCrosshairColour(r, g, b, a)` com os valores recebidos
    - Persistir a cor como JSON na chave `mri_Qfps:CrosshairColor` via `SetResourceKvp`
    - Retornar `cb("ok")`
    - _Requisitos: 2.3, 2.4, 5.1_

  - [x] 8.3 Registrar o callback `setCrosshairConfig` em `client/main.lua`
    - Validar o tamanho com `math.max(4, math.min(32, size))`
    - Persistir tamanho na chave `mri_Qfps:CrosshairSize` e estilo na chave `mri_Qfps:CrosshairStyle`
    - Retornar `cb("ok")`
    - _Requisitos: 3.4, 4.4, 5.1_

  - [x] 8.4 Registrar o callback `setCrosshairEnabled` em `client/main.lua`
    - Persistir o estado na chave `mri_Qfps:CrosshairEnabled`
    - Enviar `SendNUIMessage` para atualizar a visibilidade do overlay na NUI
    - Retornar `cb("ok")`
    - _Requisitos: 7.5_

  - [x] 8.5 Registrar os eventos `onResourceStart` e `QBCore:Client:OnPlayerLoaded` para chamar `loadCrosshairConfig()`
    - _Requisitos: 5.2, 5.3_

- [x] 9. Implementar funções auxiliares de serialização/deserialização para testes de round-trip
  - Criar funções TypeScript `saveCrosshairConfigToKvp` e `loadCrosshairConfigFromKvp` que espelham a lógica Lua
  - Essas funções serão usadas nos testes de propriedade de round-trip
  - _Requisitos: 5.4_

  - [ ]* 9.1 Escrever teste de propriedade de round-trip (Propriedade 8)
    - **Propriedade 8: Round-trip de persistência**
    - **Valida: Requisitos 5.4**

- [x] 10. Checkpoint final — Garantir que todos os testes passam
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

- [x] 11. Implementar o tipo `CrosshairDisplayMode` e atualizar `CrosshairConfig`
  - Adicionar `type CrosshairDisplayMode = 'always' | 'aiming'` em `types.ts`
  - Adicionar campo `displayMode: CrosshairDisplayMode` na interface `CrosshairConfig`
  - Atualizar `DEFAULT_CONFIG` em `constants.ts` com `displayMode: 'always'`
  - _Requisitos: 8.1_

- [x] 12. Implementar o componente `DisplayModePicker`
  - Criar `DisplayModePicker.tsx` com 2 opções: `always` ("Mira Fixa") e `aiming` ("Mira ao Mirar")
  - Destacar o modo ativo visualmente
  - Ao selecionar, chamar `onChange` com o modo correspondente
  - _Requisitos: 8.1, 8.5_

  - [x]* 12.1 Escrever teste de propriedade para o `DisplayModePicker` (Propriedade 12)
    - **Propriedade 12: Mudança de modo dispara callback com valor correto**
    - **Valida: Requisito 8.5**

- [ ] 13. Atualizar `CrosshairOverlay` para suportar `displayMode` e estado `aiming`
  - Escutar a mensagem NUI `setAiming` via `useNuiEvent` e manter estado local `aiming`
  - No modo `always`: renderizar sempre que `enabled = true` (comportamento atual)
  - No modo `aiming`: renderizar apenas quando `enabled = true` E `aiming = true`
  - No modo `preview`: ignorar `displayMode` e sempre renderizar (comportamento atual)
  - _Requisitos: 8.2, 8.3_

  - [ ]* 13.1 Escrever teste de propriedade para `CrosshairOverlay` modo `always` (Propriedade 10)
    - **Propriedade 10: Modo `always` exibe overlay independente do estado de mira**
    - **Valida: Requisito 8.2**

  - [ ]* 13.2 Escrever teste de propriedade para `CrosshairOverlay` modo `aiming` (Propriedade 11)
    - **Propriedade 11: Modo `aiming` exibe overlay somente ao mirar**
    - **Valida: Requisito 8.3**

- [~] 14. Integrar `DisplayModePicker` no `CrosshairSection`
  - Adicionar `<DisplayModePicker>` na seção de configuração
  - Ao selecionar modo: chamar `fetchNui('setCrosshairDisplayMode', { displayMode })` imediatamente e atualizar `appliedConfig`
  - Passar `displayMode` para o `CrosshairOverlay` via provider/contexto existente
  - _Requisitos: 8.1, 8.5_

- [~] 15. Implementar callback `setCrosshairDisplayMode` e `aimWatcherLoop` no Lua
  - [~] 15.1 Adicionar leitura de `mri_Qfps:CrosshairDisplayMode` em `loadCrosshairConfig()`
    - Fallback para `'always'` se ausente ou inválido
    - Incluir `displayMode` no payload enviado via `SendNUIMessage`
    - Se `displayMode == 'aiming'`, iniciar `aimWatcherLoop` após carregar
    - _Requisitos: 8.6, 8.8_

  - [~] 15.2 Implementar `aimWatcherLoop` em `client/main.lua`
    - Loop controlado por variável `isAimWatcherRunning`
    - Detectar mudança de estado via `IsPedAiming(PlayerPedId())`
    - Enviar `SendNUIMessage({ action = 'setAiming', data = { aiming = bool } })` apenas quando o estado mudar
    - Encerrar o loop quando `isAimWatcherRunning = false`
    - _Requisitos: 8.7_

  - [~] 15.3 Registrar o callback `setCrosshairDisplayMode` em `client/main.lua`
    - Validar que o valor é `'always'` ou `'aiming'`; ignorar valores inválidos
    - Persistir na chave `mri_Qfps:CrosshairDisplayMode`
    - Se `'aiming'`: iniciar `aimWatcherLoop` (se não estiver rodando)
    - Se `'always'`: parar `aimWatcherLoop` e enviar `setAiming = true` para garantir visibilidade
    - Retornar `cb("ok")`
    - _Requisitos: 8.5, 8.6, 8.7_

- [~] 16. Atualizar funções de round-trip KVP para incluir `displayMode`
  - Atualizar `saveCrosshairConfigToKvp` e `loadCrosshairConfigFromKvp` em `kvpUtils.ts`
  - _Requisitos: 5.4_

- [~] 17. Checkpoint final — Garantir que todos os testes passam após a nova feature
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

## Notas

- Tasks marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada task referencia os requisitos específicos para rastreabilidade
- Os checkpoints garantem validação incremental
- Testes de propriedade validam comportamentos universais com `fast-check` (100 iterações por propriedade)
- Testes unitários validam exemplos específicos e casos de borda com Vitest + React Testing Library
