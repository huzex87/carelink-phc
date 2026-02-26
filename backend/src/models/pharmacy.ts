import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

export class InventoryItem extends Model {
    declare id: string;
    declare name: string;
    declare category: string;
    declare stock_level: number;
    declare min_stock_level: number;
    declare unit: string;
}

InventoryItem.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING, // e.g., Antibiotics, Analgesics, Antimalarials
        allowNull: false
    },
    stock_level: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    min_stock_level: {
        type: DataTypes.INTEGER,
        defaultValue: 10
    },
    unit: {
        type: DataTypes.STRING, // e.g., tablets, vials, bottles
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'InventoryItem'
});

export class Prescription extends Model {
    declare id: string;
    declare patient_id: string;
    declare drug_name: string;
    declare dosage: string;
    declare status: 'pending' | 'dispensed';
}

Prescription.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    patient_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    drug_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dosage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'dispensed'),
        defaultValue: 'pending'
    }
}, {
    sequelize,
    modelName: 'Prescription'
});
