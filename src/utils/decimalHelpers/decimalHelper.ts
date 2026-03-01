export class DecimalHelper {
  roundToTwoDecimalsString(num: number): string {
    const roundedNumber = this.safeToFixed(num, 2);
    return roundedNumber;
  }

  roundToTwoDecimalsNumber(num: number): number {
    const roundedNumber = parseFloat(this.safeToFixed(num, 2));
    return roundedNumber;
  }

  safeToFixed(value: number, digits: number): string {
    if (!isNaN(value)) {
      return value.toFixed(digits);
    } else {
      throw new Error(
        `El valor ${value} proporcionado no es un número válido.`,
      );
    }
  }
}
