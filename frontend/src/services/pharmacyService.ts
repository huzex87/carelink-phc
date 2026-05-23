import db from '../db';

export interface PharmacyItem {
    _id: string;
    _rev?: string;
    type: 'pharmacy_item';
    name: string;
    category: string;
    unit: string;
    quantity: number;
    reorder_level: number;
    amc: number; // average monthly consumption
    created_at: string;
    updated_at: string;
}

export type StockRisk = 'critical' | 'high' | 'normal';

export const getStockRisk = (item: PharmacyItem): StockRisk => {
    const mos = item.amc > 0 ? item.quantity / item.amc : Infinity;
    if (mos < 0.5) return 'critical';
    if (mos < 1.0 || item.quantity <= item.reorder_level) return 'high';
    return 'normal';
};

export const getMOS = (item: PharmacyItem): string =>
    item.amc > 0 ? (item.quantity / item.amc).toFixed(1) : '∞';

export const getPharmacyItems = async (): Promise<PharmacyItem[]> => {
    try {
        const result = await db.find({ selector: { type: 'pharmacy_item' } });
        return (result.docs as unknown as PharmacyItem[]).sort((a, b) => a.name.localeCompare(b.name));
    } catch (err) {
        console.error('[pharmacyService] getPharmacyItems failed:', err);
        return [];
    }
};

export const savePharmacyItem = async (
    data: Omit<PharmacyItem, '_id' | '_rev' | 'type' | 'created_at' | 'updated_at'>,
): Promise<PharmacyItem> => {
    const now = new Date().toISOString();
    const doc: PharmacyItem = {
        _id: `PHARM-${Date.now()}`,
        type: 'pharmacy_item',
        created_at: now,
        updated_at: now,
        ...data,
    };
    await db.put(doc);
    return doc;
};

export const updatePharmacyItem = async (
    item: PharmacyItem,
    updates: Partial<Omit<PharmacyItem, '_id' | '_rev' | 'type' | 'created_at'>>,
): Promise<void> => {
    await db.put({ ...item, ...updates, updated_at: new Date().toISOString() });
};

const DEFAULT_ITEMS: Omit<PharmacyItem, '_id' | '_rev' | 'type' | 'created_at' | 'updated_at'>[] = [
    { name: 'Artemether/Lumefantrine 20/120mg', category: 'Antimalarial',    unit: 'Tabs',    quantity: 120,  reorder_level: 200, amc: 450  },
    { name: 'Paracetamol 500mg',                category: 'Analgesic',       unit: 'Tabs',    quantity: 2400, reorder_level: 500, amc: 1800 },
    { name: 'Amoxicillin Oral Suspension',      category: 'Antibiotic',      unit: 'Bottles', quantity: 85,   reorder_level: 100, amc: 320  },
    { name: 'Oxytocin 10IU/ml',                 category: 'Maternal Health', unit: 'Vials',   quantity: 45,   reorder_level: 30,  amc: 20   },
    { name: 'ORS Sachet',                        category: 'Rehydration',     unit: 'Sachets', quantity: 500,  reorder_level: 200, amc: 400  },
    { name: 'Cotrimoxazole 480mg',               category: 'Antibiotic',      unit: 'Tabs',    quantity: 300,  reorder_level: 150, amc: 500  },
    { name: 'Metronidazole 400mg',               category: 'Antiprotozoal',   unit: 'Tabs',    quantity: 180,  reorder_level: 100, amc: 280  },
    { name: 'Ferrous Sulphate + Folic Acid',     category: 'Maternal Health', unit: 'Tabs',    quantity: 600,  reorder_level: 200, amc: 350  },
];

/** Seeds default items only when the pharmacy is empty. Safe to call on app init. */
export const seedDefaultInventory = async (): Promise<void> => {
    try {
        const existing = await db.find({ selector: { type: 'pharmacy_item' } });
        if (existing.docs.length > 0) return;
        for (const item of DEFAULT_ITEMS) {
            await savePharmacyItem(item);
        }
    } catch (err) {
        console.error('[pharmacyService] seedDefaultInventory failed:', err);
    }
};
