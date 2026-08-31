export const PIN_LENGTH = 6;

export function validatePin(pin: string, confirmation?: string) {
  if (!new RegExp(`^\\d{${PIN_LENGTH}}$`).test(pin)) {
    return `PIN harus terdiri dari ${PIN_LENGTH} angka.`;
  }

  if (confirmation !== undefined && pin !== confirmation) {
    return "Konfirmasi PIN belum sama.";
  }

  return null;
}
