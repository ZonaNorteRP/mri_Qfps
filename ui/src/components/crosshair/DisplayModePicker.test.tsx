/**
 * Testes para o componente DisplayModePicker
 * Feature: crosshair-config
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import DisplayModePicker from './DisplayModePicker';
import type { CrosshairDisplayMode } from './types';

// Configura o número de iterações para os testes de propriedade
fc.configureGlobal({ numRuns: 100 });

// ─── Testes Unitários ────────────────────────────────────────────────────────

describe('DisplayModePicker — testes unitários', () => {
  it('renderiza as duas opções de modo', () => {
    const { getAllByRole } = render(
      <DisplayModePicker value="always" onChange={() => {}} />
    );
    const buttons = getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('destaca visualmente o modo "always" quando selecionado', () => {
    const { getAllByRole } = render(
      <DisplayModePicker value="always" onChange={() => {}} />
    );
    const buttons = getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'false');
  });

  it('destaca visualmente o modo "aiming" quando selecionado', () => {
    const { getAllByRole } = render(
      <DisplayModePicker value="aiming" onChange={() => {}} />
    );
    const buttons = getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'false');
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'true');
  });

  it('exibe os labels corretos', () => {
    const { getByText } = render(
      <DisplayModePicker value="always" onChange={() => {}} />
    );
    expect(getByText('Mira Fixa')).toBeInTheDocument();
    expect(getByText('Mira ao Mirar')).toBeInTheDocument();
  });

  it('exibe os sublabels corretos', () => {
    const { getByText } = render(
      <DisplayModePicker value="always" onChange={() => {}} />
    );
    expect(getByText('Sempre visível')).toBeInTheDocument();
    expect(getByText('Ao mirar')).toBeInTheDocument();
  });

  it('chama onChange com "always" ao clicar na primeira opção', () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <DisplayModePicker value="aiming" onChange={onChange} />
    );
    fireEvent.click(getAllByRole('button')[0]);
    expect(onChange).toHaveBeenCalledWith('always');
  });

  it('chama onChange com "aiming" ao clicar na segunda opção', () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <DisplayModePicker value="always" onChange={onChange} />
    );
    fireEvent.click(getAllByRole('button')[1]);
    expect(onChange).toHaveBeenCalledWith('aiming');
  });
});

// ─── Teste de Propriedade ────────────────────────────────────────────────────

describe('DisplayModePicker — testes de propriedade', () => {
  /**
   * Propriedade 12: Mudança de modo dispara callback com valor correto
   *
   * Para qualquer valor de displayMode em { 'always', 'aiming' }, ao selecionar
   * o modo no DisplayModePicker, o onChange deve ser chamado com exatamente o
   * valor selecionado.
   *
   * Validates: Requirements 8.5
   */
  it('Propriedade 12: onChange é chamado com o modo correto para qualquer seleção', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<CrosshairDisplayMode>('always', 'aiming'),
        (displayMode) => {
          const onChange = vi.fn();
          const { getAllByRole, unmount } = render(
            <DisplayModePicker value="always" onChange={onChange} />
          );
          const modeIndex = displayMode === 'always' ? 0 : 1;
          fireEvent.click(getAllByRole('button')[modeIndex]);
          const result = onChange.mock.calls.length === 1 && onChange.mock.calls[0][0] === displayMode;
          unmount();
          return result;
        }
      )
    );
  });

  /**
   * Propriedade 2 (aplicada ao DisplayModePicker): Seleção ativa é destacada visualmente
   *
   * Para qualquer modo selecionado, somente o botão correspondente deve ter
   * aria-pressed="true", e o outro deve ter aria-pressed="false".
   *
   * Validates: Requirements 8.1
   */
  it('Propriedade 2 (DisplayModePicker): somente o modo ativo tem aria-pressed="true"', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<CrosshairDisplayMode>('always', 'aiming'),
        (activeMode) => {
          const { getAllByRole, unmount } = render(
            <DisplayModePicker value={activeMode} onChange={() => {}} />
          );
          const buttons = getAllByRole('button');
          const alwaysIndex = 0;
          const aimingIndex = 1;

          let result: boolean;
          if (activeMode === 'always') {
            result =
              buttons[alwaysIndex].getAttribute('aria-pressed') === 'true' &&
              buttons[aimingIndex].getAttribute('aria-pressed') === 'false';
          } else {
            result =
              buttons[alwaysIndex].getAttribute('aria-pressed') === 'false' &&
              buttons[aimingIndex].getAttribute('aria-pressed') === 'true';
          }
          unmount();
          return result;
        }
      )
    );
  });
});
