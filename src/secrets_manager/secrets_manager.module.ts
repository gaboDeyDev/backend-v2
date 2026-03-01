import { Module } from '@nestjs/common';
import { SecretsManagerService } from './secrets_manager.service';

@Module({
  providers: [SecretsManagerService]
})
export class SecretsManagerModule {}
