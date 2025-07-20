export class Slug {
  public value: string

  private constructor(text: string) {
    this.value = text
  }

  static create(slug: string) {
    return new Slug(slug)
  }

  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/ _/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slugText)
  }
}
