export const envObj = {
  get BASE_URL() {
    return process.env.NEXT_PUBLIC_BASE_URL;
  },
  get SOCKET_URL() {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  },
};