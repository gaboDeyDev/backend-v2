// import { Injectable } from '@nestjs/common';
// import fs from 'fs';
// import path from 'path';
// import SftpClient from 'ssh2-sftp-client';

// @Injectable()
// export class SftpService {
//   private readonly sftp = new SftpClient();
//   private readonly privateKey = fs.readFileSync(
//     path.join(__dirname, '../../../../../priv/forza-prod/forza.pem'),
//   );

//   async listRemoteDir() {
//     await this.sftp.connect({
//       host: '187.188.248.75',
//       port: 22,
//       username: 'USRDEY',
//       privateKey: this.privateKey,
//     });

//     const isConnected = await this.sftp.exists('/');
//     console.log('🚀 ~ SftpService ~ listRemoteDir ~ isConnected:', isConnected);
//     if (!isConnected) {
//       throw new Error('SFTP connection validation failed.');
//     }

//     await this.sftp.end();

//     return isConnected;
//   }
// }
