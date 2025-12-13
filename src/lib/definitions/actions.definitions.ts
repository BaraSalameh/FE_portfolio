export type ActionResult<TResponse = void> =
    TResponse extends void
        ? { success: true } | { success: false; error: string }
        : { success: true; data: TResponse } | { success: false; error: string };
