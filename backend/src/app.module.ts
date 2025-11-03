import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { MembersModule } from './members/members.module';
import { CategoriesModule } from './categories/categories.module';
import { FieldsModule } from './fields/fields.module';
import { SessionsModule } from './sessions/sessions.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ReportsModule } from './reports/reports.module';
import { SettingsModule } from './settings/settings.module';
import { AlertsModule } from './alerts/alerts.module';
import { GuestsModule } from './guests/guests.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    MembersModule,
    CategoriesModule,
    FieldsModule,
    SessionsModule,
    TransactionsModule,
    ReportsModule,
    SettingsModule,
    AlertsModule,
    GuestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
