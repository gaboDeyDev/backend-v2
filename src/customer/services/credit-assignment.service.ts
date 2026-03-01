import { BadRequestException, Injectable } from '@nestjs/common';
import { verified_user } from '@prisma/client';
import {
  CreditAssignmentResponse,
  MOPResult,
  ValidationResponse,
  Validations,
} from 'src/model/CreditAsignamentModel';
import { Credito, CreditReport } from 'src/model/CreditReport';
import { EmploymentVerification, WorkingHistoryDetail } from 'src/model/EvaReportModel';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class CreditAssignmentService {
  constructor() { }

  CreditAssigment(
    user: verified_user,
    userSalary: any,
  ): CreditAssignmentResponse {
    const circleCreditData: CreditReport = JSON.parse(String(user.circle_credit_data));

    if (!circleCreditData) {
      throw new BadRequestException(
        'El usuario no ha pasado por el circulo de credito',
      );
    }

    //FIXME: Descomentar cuando se tenga el servicio de EVA
    // const evaData: EvaReportModel = JSON.parse(user.EvaData);

    // if (!evaData) {
    //   throw new BadRequestException('El usuario no ha pasado por EVA');
    // }

    const age = this.calculateAge(String(user.birth_date));

    //validation 1 - la edad debe ser mayor o igual a 18 y menor e igual a 65
    const validationAge = this.validateAge(age);

    //validation 2 - el score debe ser mayor de 500
    const validationScore = this.validateScore(
      circleCreditData.scores[0].valor,
    );

    const numCredits = this.calculateNumberOfCredits(circleCreditData.creditos);

    //validation 3 - el numero de créditos debe ser mayor o igual a 4
    const validationNumberOfCredits = this.validateNumberOfCredits(numCredits);

    const latePayments = this.calculateLatePayments(circleCreditData.creditos);

    //validation 4 - la cantidad de últimos pagos deben ser mayor a 8
    const validationLatePayments = this.validateLatePayments(latePayments);

    const mop = this.calculateCurrentPayment(circleCreditData.creditos);

    //validation 5
    const validationRangeActiveCredits = this.validateCurrentPayment(mop);
    /*
        //validation 6
        const validationIfItIsWorking = this.VerificationWorking(
          evaData.employmentVerification.workStatus,
        );
    
        //validation 7
        const monthsWorks = this.CalculateMonthsWorked(
          evaData.employmentVerification.workingHistory.workingHistoryDetail[0],
        );
    
        const validationMonthsWorked = this.ValidationMonthsWorked(
          evaData.employmentVerification.workStatus,
          monthsWorks,
        );
    
        //validation 8
        const incomeValidation = this.ValidateSalary(
          circleCreditData.empleos[0].salarioMensual,
        );
    
        //validation 9
        const validationAnualDeclaration = this.ValidationAnualDeclaration(
          evaData.employmentVerification,
        );
     */
    const validations: Validations = {
      validationAge,
      validationScore,
      validationNumberOfCredits,
      validationLatePayments,
      validationRangeActiveCredits,
      /* validationIfItIsWorking,
      validationMonthsWorked,
      incomeValidation,
      validationAnualDeclaration,*/
    };

    const points = this.sumaValues(validations);

    const { onDemand, microcredit, amount } = this.verifySalaryOnDemand(
      points,
      validations,
      user,
      userSalary,
    );

    const assignmentDate = new Date().toISOString();

    const endDate = new Date(
      new Date().getTime() + 15 * 24 * 60 * 60 * 1000,
    ).toISOString();

    return {
      validations,
      points,
      onDemand,
      microcredit,
      amount,
      dailySalary: Number((amount / 15).toFixed(2)),
      assignmentDate,
      endDate,
    };
  }

  /**
   * Calculates the total sum of the `value` properties from a `Validations` object.
   * @param validations An object containing multiple validation results, each with a `value` property.
   * @returns The total sum of the `value` properties from the `validations` object.
   */
  sumaValues(validations: Validations): number {
    let sum = 0;
    const validationValues = Object.values(validations);

    for (const validation of validationValues) {
      sum += validation.value;
    }

    return sum;
  }

  /**
   * Determines if a user qualifies for on-demand credit or microcredit based on their validation points and specific critical validation criteria.
   * @param points A number representing the total validation points.
   * @param validations An object containing various validation results.
   * @returns An object with `onDemand`, `microcredit`, and `amount` properties indicating the type and amount of credit the user qualifies for.
   */
  verifySalaryOnDemand(
    points: number,
    validations: Validations,
    user?: verified_user,
    userSalary?: any,
  ): { onDemand: boolean; microcredit: boolean; amount: number } {
    const {
      validationAge,
      validationScore,
      validationRangeActiveCredits,
      // validationIfItIsWorking,
      // validationMonthsWorked,
      // incomeValidation,
      validationLatePayments,
      validationNumberOfCredits,
    } = validations;

    const activeCredits = validationNumberOfCredits.approved;
    const latePayments = validationLatePayments.approved;

    // se ajusta a 3 validaciones criticas
    const criticalValidationsPassed =
      validationAge.approved &&
      validationScore.approved &&
      validationRangeActiveCredits.approved;
    // validationIfItIsWorking.approved &&
    // validationMonthsWorked.approved &&
    // incomeValidation.approved;

    //TODO: Posibles rechazos constantes de los productos
    console.log('user', user);
    console.log('points', points);
    console.log('criticalValidationsPassed', criticalValidationsPassed);
    const min = 3000;
    const rules = [
      {
        condition: criticalValidationsPassed && activeCredits && latePayments,
        percentage: 70,
        max: 7000,
      },
      {
        condition: criticalValidationsPassed && (activeCredits || latePayments),
        percentage: 60,
        max: 5000,
      },
      {
        condition:
          validationAge.approved && validationRangeActiveCredits.approved,
        percentage: 50,
        max: 3000,
      },
    ];

    const rule = rules.find(r => r.condition) || { percentage: 7000, max: 70 };

    return rule.max > 0
      ? {
        onDemand: true,
        microcredit: false,
        amount: this.redondearACentena(Math.max(
          min,
          Math.min(
            userSalary?.monthSalary * (rule.percentage / 100),
            rule.max,
          ),
        )),
      }
      : { onDemand: false, microcredit: false, amount: 0 };

    // if (
    //   (user && user?.names?.includes('microcredit')) ||
    //   (validationAge.approved &&
    //     validationScore.approved &&
    //     validationRangeActiveCredits.approved &&
    //     validationIfItIsWorking.approved &&
    //     incomeValidation.data >= 5000)
    // ) {
    //   return {
    //     onDemand: false,
    //     microcredit: true,
    //     amount: Number(process.env.MICROCREDIT_AMOUNT),
    //   };
    // }

    return { onDemand: false, microcredit: false, amount: 0 };
  }

  //Validación 1
  /**
   * Calculates the age based on the given birth date.
   *
   * @param birthDate A string representing the birth date in format 'YYYY-MM-DD'.
   * @returns A number representing the calculated age.
   */
  calculateAge(birthDate: string): number {
    const fechaActual = new Date();

    const fechaNac = new Date(birthDate);

    const añoNac = fechaNac.getFullYear();
    const añoActual = fechaActual.getFullYear();

    const yaCumplio =
      fechaActual.getMonth() > fechaNac.getMonth() ||
      (fechaActual.getMonth() === fechaNac.getMonth() &&
        fechaActual.getDate() >= fechaNac.getDate());

    const age = añoActual - añoNac - (yaCumplio ? 0 : 1);

    return age;
  }

  /**
   * Validates if the given age falls within the range of 22 to 65 years.
   * @param age - The age to be validated.
   * @returns An object indicating the validation result.
   */
  validateAge(age: number): ValidationResponse<number> {
    const approved = age >= 18 && age <= 65;
    return {
      value: approved ? 1 : 0,
      approved,
      data: age,
    };
  }

  /**
   * Validates a credit score to check if it is greater than 500.
   * @param score The credit score to be validated.
   * @returns An object with validation results.
   */
  validateScore(score: number): ValidationResponse<number> {
    const approved = score > 500;
    return {
      value: approved ? 1 : 0,
      approved,
      data: score,
    };
  }

  /**
   * Calculates the number of active credits from a list of credit records.
   * Active credits are those without a closing date.
   * @param credits An array of credit records.
   * @returns The number of active credits.
   */
  calculateNumberOfCredits(credits: Credito[]): number {
    let activeCredits: number = 0;

    if (credits.length === 0) return 0;

    credits.forEach(credit => {
      if (!credit.fechaCierreCuenta) activeCredits++;
    });

    return activeCredits;
  }

  /**
   * Validates the number of active credits.
   * @param numCredits The number of active credits to be validated.
   * @returns An object with validation result.
   */
  validateNumberOfCredits(numCredits: number): ValidationResponse<number> {
    const approved: boolean = numCredits < 6;

    return {
      value: approved ? 1 : 0,
      approved,
      data: numCredits,
    };
  }

  /**
   * Calculates the average number of late payments for a given list of credit records.
   * @param credits An array of Credito objects, each containing a numeroPagosVencidos property representing the number of late payments.
   * @returns The average number of late payments as a number.
   */
  calculateLatePayments(credits: Credito[]): number {
    if (credits.length === 0) return 0;

    const totalLatePayments = credits.reduce(
      (acc, credit) => acc + Number(credit.numeroPagosVencidos),
      0,
    );

    return Math.round(totalLatePayments / credits.length);
  }

  /**
   * Validates the number of late payments.
   * @param latePayments - The count of late payments.
   * @returns An object with validation result.
   */
  validateLatePayments(latePayments: number): ValidationResponse<number> {
    const approved = latePayments < 8;

    return {
      value: approved ? 1 : 0,
      approved,
      data: latePayments,
    };
  }

  /**
   * Calculates the Mode of Payment (MOP) code based on credit records.
   * @param credits An array of credit records.
   * @returns An object with MOP code and average overdue days.
   */
  calculateCurrentPayment(credits: Credito[]): MOPResult {
    let totalDays = 0;

    // Helper function to check if a credit record is fraudulent
    const isFraudulent = (credit: Credito) =>
      credit.clavePrevencion === 'FD' || credit.clavePrevencion === 'FN';

    // Helper function to check if a credit record represents unrecoverable debt
    const isDebtUnrecoverable = (credit: Credito) => credit.clavePrevencion;

    for (const credit of credits) {
      if (isFraudulent(credit)) return { mop: 'MOP-99' }; // Fraudulent activity by the consumer
      if (isDebtUnrecoverable(credit)) return { mop: 'MOP-97' }; // Partial or total unrecoverable debt
      if (credit.pagoActual !== 'V') {
        totalDays += credit.pagoActual !== '--' ? Number(credit.pagoActual) : 0;
      }
    }

    const averageDays = Math.round(totalDays / credits.length);
    const mopCode = this.setMOPCode(averageDays);

    return { mop: `MOP-${mopCode}`, numberDays: averageDays };
  }

  /**
   * Determines the MOP (Mode of Payment) code based on the average number of days a payment is overdue.
   * @param media A number representing the average number of days a payment is overdue.
   * @returns A string representing the MOP code based on the average number of days a payment is overdue.
   */
  setMOPCode(media: number): string {
    if (media === 0) return '00';
    if (media === 1) return '01';
    if (media >= 2 && media <= 29) return '02';
    if (media >= 30 && media <= 59) return '03';
    if (media >= 60 && media <= 89) return '04';
    if (media >= 90 && media <= 119) return '05';
    if (media >= 120 && media <= 179) return '06';
    if (media >= 180) return '07';
    return ''; // Default return if media is not in any specified range
  }

  /**
   * Validates the current payment based on the Mode of Payment (MOP) code.
   * @param data An object of type MOPResult containing the MOP code and optionally the number of overdue days.
   * @returns An object of type ValidationResponse<MOPResult> indicating whether the payment status is approved and the original data.
   */
  validateCurrentPayment(data: MOPResult): ValidationResponse<MOPResult> {
    const approved = data.mop === 'MOP-00' || data.mop === 'MOP-01' || data.mop === 'MOP-02' || data.mop === 'MOP-97';
    return {
      value: approved ? 1 : 0,
      approved,
      data,
    };
  }

  /**
   * Validates if a user is currently working based on their work status.
   * @param workStatus - The work status of the user, either 'W' (working) or 'NW' (not working).
   * @returns An object with validation response including value, approved, and the original workStatus.
   */
  VerificationWorking(workStatus: 'W' | 'NW'): ValidationResponse<'W' | 'NW'> {
    const value = workStatus === 'W' ? 1 : 0;
    const approved = workStatus === 'W';
    return { value, approved, data: workStatus };
  }

  // validate 7
  /**
   * Calculates the number of months worked based on the start date and current date.
   * If the start date is in the future, returns 0.
   *
   * @param data The working history detail containing the start date.
   * @returns The number of months worked.
   */
  CalculateMonthsWorked(data: WorkingHistoryDetail): number {
    if (data.endDate) {
      return 0;
    }
    const startDate = new Date(data.startDate);
    const now = new Date();

    if (startDate > now) {
      return 0;
    }

    let monthsWorked = (now.getFullYear() - startDate.getFullYear()) * 12;
    monthsWorked -= startDate.getMonth();
    monthsWorked += now.getMonth() - 1;

    if (now.getDate() < startDate.getDate()) {
      monthsWorked--;
    }

    return monthsWorked;
  }

  /**
   * Validates if a user has been working for at least 6 months.
   * @param workStatus A string indicating the work status ('W' for working, 'NW' for not working).
   * @param months A number representing the number of months worked.
   * @returns An object with `value` (0 or 1), `approved` (boolean), and `data` (number of months worked or 0).
   */
  ValidationMonthsWorked(
    workStatus: string,
    months: number,
  ): ValidationResponse<number> {
    if (workStatus === 'W' && months >= 6) {
      return {
        value: 1,
        approved: true,
        data: months,
      };
    }
    return {
      value: 0,
      approved: false,
      data: workStatus === 'NW' ? 0 : months,
    };
  }

  /**
   * Validates the given salary to meet a minimum threshold of 10,000.
   * @param salaryCycleCredit The salary to be validated.
   * @returns An object with validation result including value (0 or 1), approval status, and original salary.
   */
  ValidateSalary(salaryCycleCredit: number): ValidationResponse<number> {
    const isApproved: boolean = salaryCycleCredit >= 10000;

    return {
      value: isApproved ? 1 : 0,
      approved: isApproved,
      data: salaryCycleCredit,
    };
  }

  /**
   * Validates the annual declaration status of a user's employment verification.
   * @param data - An object of type `EmploymentVerification` containing employment details, including `affiliationStatus`.
   * @returns An object of type `ValidationResponse<string>` indicating whether the annual declaration is approved or not, along with the `affiliationStatus`.
   */
  ValidationAnualDeclaration(
    data: EmploymentVerification,
  ): ValidationResponse<string> {
    const { affiliationStatus } = data;

    if (affiliationStatus && affiliationStatus !== 'INACTIVO') {
      return {
        value: 1,
        approved: true,
        data: affiliationStatus,
      };
    }

    return {
      value: 0,
      approved: false,
      data: String(affiliationStatus),
    };
  }

  redondearACentena(numero) {
    return Math.round(numero / 100) * 100;
  }
}
