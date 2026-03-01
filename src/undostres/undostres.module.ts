import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UndostresController } from './undostres.controller';
import { UndostresService } from './services/undostres.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { UNDOSTRES_CLIENT_FACTURABLE, UNDOSTRES_CLIENT_NO_FACTURABLE } from './symbols/symbols';
import axios from 'axios';
import {  UDTCategoryType } from './types/categories.type';
import { UndostresPrismaService } from './db/undostres_prisma.service';
import { UndostresCuotasService } from './services/undostres_cuotas.service';
import { PomeloModule } from 'src/pomelo/pomelo.module';
import { UserPomeloService } from './services/user_pomelo.service';

@Global()
@Module({})
export class UndostresModule {
  static init(): DynamicModule {
    const ModuleClient: Provider = {
      provide: UNDOSTRES_CLIENT_NO_FACTURABLE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
      const axiosInstance = axios.create({
        baseURL: configService.get<string>('UNDOESTRES_URL'),
        headers: {
        'Content-Type': 'application/json',
        },
      });

      axiosInstance.interceptors.request.use((config) => {
        config.headers['x-api-key'] = configService.get<string>('UNDOSTRES_API_KEY_NO_FACT');

        return config;
      });

      return new HttpService(axiosInstance);
      },
    };

    const ModuleClientNoFacturable: Provider = {
      provide: UNDOSTRES_CLIENT_FACTURABLE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
      const axiosInstance = axios.create({
        baseURL: configService.get<string>('UNDOESTRES_URL'),
        headers: {
        'Content-Type': 'application/json',
        },
      });

      axiosInstance.interceptors.request.use((config) => {
        config.headers['x-api-key'] = configService.get<string>('UNDOSTRES_API_KEY_FACT');
        return config;
      });

      return new HttpService(axiosInstance);
      },
    };

    return {
      module: UndostresModule,
      imports: [HttpModule, ConfigModule, PomeloModule],
      providers: [UndostresService, ModuleClient, ModuleClientNoFacturable, UndostresPrismaService, UndostresCuotasService, UserPomeloService],
      controllers: [UndostresController],
    };
  }
}
