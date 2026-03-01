// import { Injectable } from "@nestjs/common";
// import { Prisma } from "@dey/prisma/accounts";
// import { DefaultArgs } from "@dey/prisma/accounts/runtime/library";
// import validateStepQuery from "../query/registration_procedure/validate_step.query";
// import getOboardingQuery from "../query/registration_procedure/get_onboarding.query";
// import { firstValueFrom, from } from "rxjs";
// import { AccountsPrismaService } from "src/prisma/accounts_prisma.service";
// import { OnBoardingStep } from "../types/onboarding.type";

// @Injectable()
// export class RegistrationProcedureRepository {

//     private repository: Prisma.RegistrationProcedureDelegate<DefaultArgs, Prisma.PrismaClientOptions>;

//     constructor(
//         private readonly prismaService:AccountsPrismaService
//     ){
//         this.repository = prismaService.registrationProcedure;
//     }

//     async getSteps(id: string) {
//         const { where } = getOboardingQuery(id);

//         return await firstValueFrom(from(this.repository.findFirst({ where })));
//     }
    
//     async validateStep(id: string, step: OnBoardingStep) {
        
//         const { where, data } = validateStepQuery(id, step);

//         return  await this.repository.updateMany({ where: where as any, data: data as any });
//     }

// }