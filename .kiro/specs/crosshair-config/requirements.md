# Documento de Requisitos

## Introdução

Esta feature adiciona uma seção de configuração de mira (crosshair) dentro do menu NUI existente do recurso `mri_Qfps`, acessível pelo comando `/fps`. O jogador poderá personalizar a cor, o tamanho e o estilo da mira diretamente pela interface, com as configurações persistidas via `ResourceKvp` e aplicadas em tempo real no client-side.

Como o GTA V não oferece natives para tamanho e estilo de crosshair, essas duas propriedades serão implementadas como um overlay CSS renderizado pela NUI, sobreposto à mira nativa do jogo. A cor da mira nativa será controlada via `SetCrosshairColour`.

---

## Glossário

- **Crosshair_Config**: O módulo de configuração de mira descrito neste documento.
- **Menu_FPS**: O menu NUI existente aberto pelo comando `/fps`.
- **NUI**: Interface de usuário baseada em HTML/CSS/JS renderizada pelo FiveM dentro do jogo.
- **Overlay_Crosshair**: Elemento visual renderizado pela NUI que simula estilos e tamanhos de mira não suportados por natives nativos do GTA V.
- **ResourceKvp**: Mecanismo de persistência de dados no client-side do FiveM (`SetResourceKvp` / `GetResourceKvpString`).
- **NUI_Callback**: Mecanismo de comunicação da NUI para o Lua client-side via `RegisterNUICallback` / `fetchNui`.
- **Cor_Mira**: Valor de cor selecionado pelo jogador para a mira, representado como um conjunto de valores RGBA.
- **Tamanho_Mira**: Escala do Overlay_Crosshair, expressa em pixels.
- **Estilo_Mira**: Formato visual do Overlay_Crosshair (ex: ponto, cruz, círculo).

---

## Requisitos

### Requisito 1: Exibição da Seção de Configuração de Mira

**User Story:** Como jogador, quero ver uma seção de configuração de mira dentro do menu `/fps`, para que eu possa personalizar minha mira sem sair do menu de otimizações.

#### Critérios de Aceitação

1. THE Menu_FPS SHALL exibir uma seção dedicada à configuração de mira, separada visualmente das seções de presets e sliders existentes.
2. WHEN o Menu_FPS é aberto, THE Crosshair_Config SHALL carregar e exibir as configurações salvas anteriormente pelo jogador.
3. IF nenhuma configuração prévia for encontrada no ResourceKvp, THEN THE Crosshair_Config SHALL aplicar os valores padrão: cor branca (255, 255, 255, 255), tamanho 10px, estilo ponto.

---

### Requisito 2: Configuração de Cor da Mira

**User Story:** Como jogador, quero selecionar a cor da mira entre opções predefinidas, para que eu possa identificar a mira com facilidade em diferentes cenários do jogo.

#### Critérios de Aceitação

1. THE Crosshair_Config SHALL oferecer ao menos 5 opções de cor predefinidas: branco (255, 255, 255), vermelho (255, 0, 0), verde (0, 255, 0), amarelo (255, 255, 0) e ciano (0, 255, 255).
2. WHEN o jogador seleciona uma cor, THE Crosshair_Config SHALL invocar o NUI_Callback `setCrosshairColor` com os valores RGBA correspondentes.
3. WHEN o NUI_Callback `setCrosshairColor` é recebido, THE Crosshair_Config SHALL chamar `SetCrosshairColour(r, g, b, a)` para aplicar a cor na mira nativa do GTA V.
4. WHEN o NUI_Callback `setCrosshairColor` é recebido, THE Crosshair_Config SHALL persistir a cor selecionada no ResourceKvp com a chave `mri_Qfps:CrosshairColor`.
5. WHEN o jogador seleciona uma cor, THE Menu_FPS SHALL destacar visualmente a opção selecionada, diferenciando-a das demais opções.

---

### Requisito 3: Configuração de Tamanho da Mira

**User Story:** Como jogador, quero ajustar o tamanho da mira via slider, para que eu possa calibrar a visibilidade da mira conforme minha preferência.

#### Critérios de Aceitação

1. THE Crosshair_Config SHALL exibir um slider de tamanho com valor mínimo de 4px, valor máximo de 32px e incremento de 1px.
2. WHEN o jogador move o slider de tamanho, THE Menu_FPS SHALL atualizar em tempo real a pré-visualização do Overlay_Crosshair com o novo tamanho.
3. WHEN o jogador clica em "Aplicar Mira", THE Crosshair_Config SHALL invocar o NUI_Callback `setCrosshairConfig` com o tamanho selecionado.
4. WHEN o NUI_Callback `setCrosshairConfig` é recebido com um valor de tamanho, THE Crosshair_Config SHALL persistir o valor no ResourceKvp com a chave `mri_Qfps:CrosshairSize`.
5. WHEN o recurso é iniciado ou o jogador faz login, THE Crosshair_Config SHALL recuperar o tamanho salvo do ResourceKvp e aplicá-lo ao Overlay_Crosshair.

---

### Requisito 4: Configuração de Estilo da Mira

**User Story:** Como jogador, quero escolher o estilo visual da mira entre opções predefinidas, para que eu possa usar o formato que melhor se adapta ao meu estilo de jogo.

#### Critérios de Aceitação

1. THE Crosshair_Config SHALL oferecer ao menos 3 estilos predefinidos de Overlay_Crosshair: ponto (dot), cruz (cross) e círculo (circle).
2. WHEN o jogador seleciona um estilo, THE Menu_FPS SHALL atualizar em tempo real a pré-visualização do Overlay_Crosshair com o novo estilo.
3. WHEN o jogador clica em "Aplicar Mira", THE Crosshair_Config SHALL invocar o NUI_Callback `setCrosshairConfig` com o estilo selecionado.
4. WHEN o NUI_Callback `setCrosshairConfig` é recebido com um valor de estilo, THE Crosshair_Config SHALL persistir o valor no ResourceKvp com a chave `mri_Qfps:CrosshairStyle`.
5. WHEN o jogador seleciona um estilo, THE Menu_FPS SHALL destacar visualmente o estilo selecionado, diferenciando-o dos demais.

---

### Requisito 5: Persistência e Restauração das Configurações

**User Story:** Como jogador, quero que minhas configurações de mira sejam salvas automaticamente, para que eu não precise reconfigurar a mira toda vez que entrar no servidor.

#### Critérios de Aceitação

1. WHEN o jogador aplica qualquer configuração de mira, THE Crosshair_Config SHALL persistir todos os valores (cor, tamanho, estilo) no ResourceKvp antes de retornar `cb("ok")` ao NUI_Callback.
2. WHEN o evento `QBCore:Client:OnPlayerLoaded` é disparado, THE Crosshair_Config SHALL recuperar as configurações salvas do ResourceKvp e aplicá-las ao Overlay_Crosshair e à mira nativa.
3. WHEN o evento `onResourceStart` é disparado para o recurso `mri_Qfps`, THE Crosshair_Config SHALL recuperar as configurações salvas do ResourceKvp e aplicá-las ao Overlay_Crosshair e à mira nativa.
4. FOR ALL conjuntos válidos de configurações de mira, salvar e depois recuperar as configurações do ResourceKvp SHALL produzir valores equivalentes aos originais (propriedade de round-trip).

---

### Requisito 6: Pré-visualização em Tempo Real

**User Story:** Como jogador, quero ver uma pré-visualização da mira dentro do menu enquanto ajusto as configurações, para que eu possa avaliar o resultado antes de aplicar.

#### Critérios de Aceitação

1. THE Menu_FPS SHALL exibir um componente de pré-visualização do Overlay_Crosshair dentro da seção de configuração de mira.
2. WHEN o jogador altera cor, tamanho ou estilo, THE Menu_FPS SHALL atualizar o componente de pré-visualização imediatamente, sem necessidade de clicar em "Aplicar Mira".
3. THE Menu_FPS SHALL renderizar o componente de pré-visualização sobre um fundo neutro (escuro), para que o contraste da mira seja visível independentemente da cor selecionada.

---

### Requisito 7: Ativação e Desativação do Overlay

**User Story:** Como jogador, quero poder ativar ou desativar o overlay de mira customizado, para que eu possa usar a mira padrão do jogo quando preferir.

#### Critérios de Aceitação

1. THE Crosshair_Config SHALL exibir um controle de alternância (toggle) para ativar ou desativar o Overlay_Crosshair.
2. WHEN o jogador desativa o Overlay_Crosshair, THE Crosshair_Config SHALL invocar o NUI_Callback `setCrosshairEnabled` com o valor `false`.
3. WHEN o NUI_Callback `setCrosshairEnabled` é recebido com `false`, THE Crosshair_Config SHALL ocultar o Overlay_Crosshair na NUI e restaurar o comportamento padrão da mira nativa.
4. WHEN o NUI_Callback `setCrosshairEnabled` é recebido com `true`, THE Crosshair_Config SHALL exibir o Overlay_Crosshair na NUI com as configurações salvas.
5. WHEN o NUI_Callback `setCrosshairEnabled` é recebido, THE Crosshair_Config SHALL persistir o estado (ativo/inativo) no ResourceKvp com a chave `mri_Qfps:CrosshairEnabled`.

---

### Requisito 8: Modo de Exibição da Mira

**User Story:** Como jogador, quero escolher entre dois modos de exibição da mira customizada, para que eu possa decidir se ela fica sempre visível ou aparece apenas quando estou mirando com uma arma.

#### Critérios de Aceitação

1. THE Crosshair_Config SHALL exibir um seletor de modo de exibição com duas opções: "Mira Fixa" (`always`) e "Mira ao Mirar" (`aiming`).
2. WHEN o modo "Mira Fixa" está selecionado, THE Overlay_Crosshair SHALL ser exibido continuamente na tela, independente do estado de mira do jogador.
3. WHEN o modo "Mira ao Mirar" está selecionado e o jogador está mirando com uma arma, THE Overlay_Crosshair SHALL ser exibido.
4. WHEN o modo "Mira ao Mirar" está selecionado e o jogador não está mirando, THE Overlay_Crosshair SHALL ser ocultado.
5. WHEN o jogador seleciona um modo de exibição, THE Crosshair_Config SHALL invocar o NUI_Callback `setCrosshairDisplayMode` com o valor correspondente (`'always'` ou `'aiming'`).
6. WHEN o NUI_Callback `setCrosshairDisplayMode` é recebido, THE Crosshair_Config SHALL persistir o modo no ResourceKvp com a chave `mri_Qfps:CrosshairDisplayMode`.
7. WHEN o modo "Mira ao Mirar" está ativo, THE Crosshair_Config SHALL detectar o estado de mira via `IsPedAiming(PlayerPedId())` em um loop Lua e notificar a NUI via `SendNUIMessage({ action = 'setAiming', data = { aiming = bool } })`.
8. WHEN o modo de exibição é restaurado do ResourceKvp como `'aiming'`, THE Crosshair_Config SHALL iniciar automaticamente o loop de detecção de mira.
