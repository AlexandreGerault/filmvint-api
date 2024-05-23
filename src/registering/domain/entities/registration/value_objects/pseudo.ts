export class Pseudo {
  private pseudo: string

  constructor(pseudo: string) {
    this.pseudo = pseudo
  }

  value(): string {
    return this.pseudo
  }
}
