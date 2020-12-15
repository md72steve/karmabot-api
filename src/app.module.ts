import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { KarmaModule } from './karma/karma.module';

@Module({
  imports: [
    KarmaModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
