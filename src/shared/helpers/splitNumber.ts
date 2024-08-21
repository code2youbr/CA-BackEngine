export function splitPhoneNumber(telephoneNumber: string) {
  const country = telephoneNumber.slice(0, 2); // Pega os dois primeiros dígitos
  const area = telephoneNumber.slice(2, 4);   // Pega os dois dígitos seguintes
  const number = telephoneNumber.slice(4);    // Pega o restante do número

  return {
    country,
    area,
    number,
  };
}