export class InvalidRefError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidRefError';
  }
}

export class InvalidAnchorKey extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidAnchorKey';
  }
}
