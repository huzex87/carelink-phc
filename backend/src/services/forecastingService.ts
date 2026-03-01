import { InventoryItem, Prescription } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * AI-Driven Forecasting Service
 * Predicts stock-out dates and identifies consumption anomalies.
 */
export class ForecastingService {
    /**
     * Predicts days of stock remaining for a specific inventory item.
     * Uses a velocity-based linear projection.
     */
    static async predictStockOutDate(itemId: string): Promise<{
        daysRemaining: number;
        predictedStockOutDate: Date | null;
        confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    }> {
        const item = await InventoryItem.findByPk(itemId);
        if (!item) throw new Error('Inventory item not found');

        // Fetch last 90 days of consumption to establish velocity
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const consumptionData = await Prescription.findAll({
            where: {
                drug_name: { [Op.iLike]: `%${item.name}%` },
                status: 'dispensed',
                updatedAt: { [Op.gte]: ninetyDaysAgo }
            },
            attributes: ['updatedAt'],
            order: [['updatedAt', 'ASC']]
        });

        if (consumptionData.length < 5) {
            return {
                daysRemaining: -1, // Insufficient data
                predictedStockOutDate: null,
                confidence: 'LOW'
            };
        }

        // Group consumption by day
        const dailyConsumption: Record<string, number> = {};
        consumptionData.forEach(c => {
            const updatedAt = c.getDataValue('updatedAt');
            if (updatedAt) {
                const dateStr = new Date(updatedAt).toISOString().split('T')[0];
                dailyConsumption[dateStr] = (dailyConsumption[dateStr] || 0) + 1;
            }
        });

        const counts = Object.values(dailyConsumption);
        const avgDailyVelocity = counts.reduce((a, b) => a + b, 0) / counts.length;

        if (avgDailyVelocity === 0) {
            return {
                daysRemaining: Infinity,
                predictedStockOutDate: null,
                confidence: 'MEDIUM'
            };
        }

        const daysRemaining = Math.floor(item.stock_level / avgDailyVelocity);
        const predictedDate = new Date();
        predictedDate.setDate(predictedDate.getDate() + daysRemaining);

        // Confidence based on data density (more days of record = higher confidence)
        const confidence = counts.length > 30 ? 'HIGH' : (counts.length > 10 ? 'MEDIUM' : 'LOW');

        return {
            daysRemaining,
            predictedStockOutDate: predictedDate,
            confidence
        };
    }

    /**
     * Detects unusual spikes in consumption (potential outbreak warning)
     */
    static async detectConsumptionSpikes(itemName: string): Promise<boolean> {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentConsumption = await Prescription.count({
            where: {
                drug_name: { [Op.iLike]: `%${itemName}%` },
                status: 'dispensed',
                updatedAt: { [Op.gte]: sevenDaysAgo }
            }
        });

        const lastSevenAvg = recentConsumption / 7;

        // Compare with baseline (previous 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 37); // Avoid overlapping with last 7

        const baselineConsumption = await Prescription.count({
            where: {
                drug_name: { [Op.iLike]: `%${itemName}%` },
                status: 'dispensed',
                updatedAt: {
                    [Op.gte]: thirtyDaysAgo,
                    [Op.lt]: sevenDaysAgo
                }
            }
        });

        const baselineAvg = baselineConsumption / 30;

        // Alert if recent consumption is > 2x the baseline average
        return baselineAvg > 0 && lastSevenAvg > (baselineAvg * 2);
    }
}
