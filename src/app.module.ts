import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { KarmaModule } from './karma/karma.module';

@Module({
  imports: [
    KarmaModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot(getMongoDBConnectionString(), { useNewUrlParser: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

function getMongoDBConnectionString(): string {
  const mongoDbUser = configuration().mongodb.user;
  const mongoDbPass = configuration().mongodb.password;

  const connectionString = `mongodb+srv://${mongoDbUser}:${mongoDbPass}@karmabot-cluster-0.p9lot.mongodb.net/karmabot?retryWrites=true&w=majority`;

  return connectionString;
}
