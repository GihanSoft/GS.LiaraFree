export const UNAUTHORIZED_EVENT = 'unauthorized';

const api = async (
  url: string | URL | globalThis.Request,
  init?: RequestInit
) => {
  const response = await fetch(url, init);
  if (response.status === 401) {
    window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
  }
  return response;
};

export default api;
