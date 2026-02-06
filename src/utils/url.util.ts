/* URL 유효성 검사 */
export const checkOriginFromUrl = (
  url: string,
): { isValidUrl: true; originUrl: string } | { isValidUrl: false; originUrl?: string } => {
  try {
    return { isValidUrl: true, originUrl: new URL(url).origin };
  } catch {
    return { isValidUrl: false };
  }
};
