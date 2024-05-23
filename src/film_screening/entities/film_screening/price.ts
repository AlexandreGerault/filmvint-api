type Currency = { currency: 'EUR'; symbol: '€'; decimalPlaces: 2 }

const Currencies: Record<Currency['currency'], Currency> = {
  EUR: { currency: 'EUR', symbol: '€', decimalPlaces: 2 },
} as const

export class Price {
  readonly value: number
  readonly currency: Currency = Currencies.EUR

  constructor(value: number) {
    this.value = value
  }

  static of(value: number): Price {
    return new Price(value)
  }
}
