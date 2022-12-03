import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixturesModule } from 'src/modules/fixtures/fixtures.module';
import { TeamsModule } from 'src/modules/teams/teams.module';
import { getConnectionOptions } from 'typeorm';
import configuration from '../config/configuration';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    FixturesModule,
    TeamsModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => getConnectionOptions('default'),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => getConnectionOptions('reader'),
    }),
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env.development' : `.env.${ENV}`,
      load: [configuration],
      isGlobal: true,
    }),
    HttpModule,
  ],
})
export class AppModule {}
