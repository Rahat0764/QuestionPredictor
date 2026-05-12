export type UploadState =
  | { success: false; error: string; results: null }
  | { success: true; error?: never; results: { url: string; text: string }[] };