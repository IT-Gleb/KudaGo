export function getNowYear(): string {
  const dt = new Date();
  return `${dt.getUTCFullYear()}`;
}
