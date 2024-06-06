import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TelegramModule } from 'nestjs-telegram';

// import type { ConfigKeyPaths } from '~/config';
import type { ConfigKeyPaths, ISecurityConfig } from '../../config'; // fix: vercel issue

import { ContactService } from './services';
import { ContactController } from './controllers';

@Module({
  imports: [
    TelegramModule.forRootAsync({
      useFactory: async (configService: ConfigService<ConfigKeyPaths>) => {
        const { telegramBotApiKey } =
          configService.get<ISecurityConfig>('security');

        return {
          botKey: telegramBotApiKey,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
