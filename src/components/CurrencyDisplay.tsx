import { formatCurrency } from '../engine/Currency'

interface Props {
  currency: number
  passiveIncome: number
  clickValue: number
}

export function CurrencyDisplay({ currency, passiveIncome, clickValue }: Props) {
  return (
    <div className="bg-gray-800 px-6 py-3 flex gap-8 items-center border-b border-gray-700">
      <div>
        <span className="text-yellow-400 text-2xl font-bold">${formatCurrency(currency)}</span>
        <span className="text-gray-400 text-sm ml-2">crypto</span>
      </div>
      <div className="text-gray-400 text-sm">+${formatCurrency(passiveIncome)}/sec</div>
      <div className="text-gray-400 text-sm">${formatCurrency(clickValue)}/click</div>
    </div>
  )
}
