import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Obtiene las estadísticas agregadas para el dashboard.
     * Utiliza Promise.all para ejecutar todas las consultas a la base de datos en paralelo,
     * reduciendo el tiempo total de respuesta.
     */
    async getStats(): Promise<DashboardStatsDto> {
        const now = new Date();

        // Rango de fechas para el mes actual
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Rango de fechas para el mes anterior
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        // Ejecutamos las consultas en paralelo para mejorar el rendimiento
        const [
            totalProducts,
            activeProducts,
            totalCategories,
            totalOccasions,
            thisMonthProductsCreated,
            lastMonthProductsCreated
        ] = await Promise.all([
            // 1. Total de productos
            this.prisma.product.count(),

            // 2. Total de productos activos
            this.prisma.product.count({
                where: { isActive: true }
            }),

            // 3. Total de categorías
            this.prisma.category.count(),

            // 4. Total de ocasiones
            this.prisma.occasion.count(),

            // 5. Productos creados este mes
            this.prisma.product.count({
                where: {
                    createdAt: {
                        gte: startOfThisMonth,
                    },
                },
            }),

            // 6. Productos creados el mes pasado
            this.prisma.product.count({
                where: {
                    createdAt: {
                        gte: startOfLastMonth,
                        lte: endOfLastMonth,
                    },
                },
            }),
        ]);

        const inactiveProducts = totalProducts - activeProducts;

        // Calculamos el porcentaje de crecimiento comparando productos creados este mes vs el mes pasado
        let growthPercentage = 0;

        if (lastMonthProductsCreated === 0) {
            // Manejamos el caso donde no hubo productos el mes pasado.
            // Si este mes sí se crearon, lo consideramos como un crecimiento del 100%.
            if (thisMonthProductsCreated > 0) {
                growthPercentage = 100;
            }
        } else {
            // Fórmula: ((esteMes - mesPasado) / mesPasado) * 100
            growthPercentage = ((thisMonthProductsCreated - lastMonthProductsCreated) / lastMonthProductsCreated) * 100;
        }

        return {
            totalProducts,
            activeProducts,
            inactiveProducts,
            totalCategories,
            totalOccasions,
            // Redondeamos a 2 decimales para devolver un número más limpio a la UI
            growthPercentage: Number(growthPercentage.toFixed(2)),
        };
    }
}
