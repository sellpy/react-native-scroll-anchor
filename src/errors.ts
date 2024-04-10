export class InvalidRefError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidRefError';
  }
}

export class InvalidAnchorName extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidAnchorName';
  }
}
