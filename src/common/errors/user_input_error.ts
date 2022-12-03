export class UserInputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserInputError';
  }
}
