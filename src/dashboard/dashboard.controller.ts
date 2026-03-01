import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('admin/dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(60000) // TTL de 60 segundos para evitar sobrecargar la BD si se entra mucho al dashboard
    getStats(): Promise<DashboardStatsDto> {
        // La lógica de negocio y las consultas se delegan completamente al service
        return this.dashboardService.getStats();
    }
}
