export type ActionStatus = 'error' | 'success';

export interface ActionResult<TPayload = undefined> {
  message?: string;
  payload?: TPayload;
  status: ActionStatus;
}

export const actionError = <TPayload = undefined>(
  message?: string,
): ActionResult<TPayload> => ({
  message,
  status: 'error',
});

export const actionSuccess = <TPayload = undefined>(
  payload?: TPayload,
  message?: string,
): ActionResult<TPayload> => ({
  message,
  payload,
  status: 'success',
});
