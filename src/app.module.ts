import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { OccasionsModule } from './occasions/occasions.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [ProductsModule, PrismaModule, CategoriesModule, OccasionsModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
