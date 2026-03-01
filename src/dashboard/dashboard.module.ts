import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        PrismaModule,
        // Registramos el CacheModule globalmente para este módulo con configuraciones por defecto
        CacheModule.register({
            ttl: 60000,
        }),
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
