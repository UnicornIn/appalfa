import type { Money } from '../types/api';

/** 39900 → "$39.900" */
export function formatMoney(money: Money): string {
  return `$${money.amount.toLocaleString('es-CO')}`;
}

/** ISO date → "07 de octubre de 2026" */
export function formatLongDate(iso: string | Date): string {
  const date = typeof iso === 'string' ? new Date(iso) : iso;
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' });
}
