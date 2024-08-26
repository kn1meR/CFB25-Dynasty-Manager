export function capitalizeName(name: string): string {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-')
      .split("'")
      .map((word, index) => index > 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
      .join("'");
  }