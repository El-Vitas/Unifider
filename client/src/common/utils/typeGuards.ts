import type { HttpErrorResponse } from '../types';

export function isHttpErrorResponse(
  error: unknown,
): error is HttpErrorResponse {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  if (!(error instanceof Error)) {
    return false;
  }
  if (!('response' in error)) {
    return false;
  }
  const potentialResponse = (error as { response: unknown }).response;
  if (typeof potentialResponse !== 'object' || potentialResponse === null) {
    return false;
  }
  if (
    !('status' in potentialResponse) ||
    typeof (potentialResponse as { status: unknown }).status !== 'number'
  ) {
    return false;
  }
  return true;
}
