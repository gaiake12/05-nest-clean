export abstract class HasheGenerator {
  abstract hash(plain: string): Promise<string>;
}
