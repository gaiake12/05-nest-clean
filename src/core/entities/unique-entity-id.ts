import { randomUUID } from 'node:crypto'

export class UniqueEntityID {
  private value: string

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  constructor(id?: string) {
    this.value = id ?? randomUUID()
  }

  equals(id: UniqueEntityID) {
    return id.toValue() === this.value
  }
}
