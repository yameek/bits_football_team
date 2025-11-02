import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { MembersModule } from './members/members.module';
import { CategoriesModule } from './categories/categories.module';
import { FieldsModule } from './fields/fields.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    MembersModule,
    CategoriesModule,
    FieldsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
