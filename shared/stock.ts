export const LOW_STOCK_THRESHOLD = 5

export type StockStatus =
  | { kind: 'out' }
  | { kind: 'low', remaining: number }
  | { kind: 'in' }

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return { kind: 'out' }
  if (stock < LOW_STOCK_THRESHOLD) return { kind: 'low', remaining: stock }
  return { kind: 'in' }
}

export function getStockLabel(status: StockStatus): string {
  switch (status.kind) {
    case 'out':
      return 'Rupture de stock'
    case 'low':
      return `Plus que ${status.remaining} en stock`
    case 'in':
      return 'En stock'
  }
}
