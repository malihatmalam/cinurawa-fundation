export interface IValidationError {
  field: string;
  message: string;
  friendlyMessage: string;
  value?: unknown;
}
