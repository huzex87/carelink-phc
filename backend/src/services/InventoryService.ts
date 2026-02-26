import { InventoryItem, Prescription } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Inventory & LMIS Service
 * Handles medical supply chain logic synchronized with clinical activity.
 */
export class InventoryService {
    /**
     * Atomics stocks update based on prescription fulfillment
     */
    static async dispenseMedication(prescriptionId: string) {
        const rx = await Prescription.findByPk(prescriptionId);
        if (!rx || rx.status === 'dispensed') {
            throw new Error('Prescription not found or already dispensed');
        }

        // Find corresponding inventory item
        const item = await InventoryItem.findOne({
            where: { name: { [Op.iLike]: `%${rx.drug_name}%` } }
        });

        if (!item) {
            throw new Error(`Inventory item for ${rx.drug_name} not found in LMIS`);
        }

        if (item.stock_level < 1) {
            throw new Error(`Stock-out: ${rx.drug_name} is currently unavailable`);
        }

        // Atomic update
        await item.decrement('stock_level', { by: 1 });
        await rx.update({ status: 'dispensed' });

        console.log(`[LMIS] Dispensed ${rx.drug_name}. New stock level: ${item.stock_level - 1}`);

        return { success: true, remaining: item.stock_level - 1 };
    }

    /**
     * Calculate Average Monthly Consumption (AMC)
     * Essential for reordering logic in PHCs.
     */
    static async calculateAMC(itemName: string): Promise<number> {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const consumption = await Prescription.count({
            where: {
                drug_name: { [Op.iLike]: `%${itemName}%` },
                status: 'dispensed',
                updatedAt: { [Op.gte]: thirtyDaysAgo }
            }
        });

        return consumption; // Simple monthly count for now
    }
}
