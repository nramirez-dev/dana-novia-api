import { Controller, Get, UseInterceptors, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @UseGuards(JwtAuthGuard)
    @Get('stats')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(60000) // TTL de 60 segundos para evitar sobrecargar la BD si se entra mucho al dashboard
    getStats(): Promise<DashboardStatsDto> {
        // La lógica de negocio y las consultas se delegan completamente al service
        return this.dashboardService.getStats();
    }
}
