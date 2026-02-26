import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

export class Referral extends Model {
    declare id: string;
    declare patient_id: string;
    declare referring_facility: string;
    declare receiving_facility: string;
    declare reason: string;
    declare clinical_summary: string;
    declare status: 'pending' | 'accepted' | 'completed' | 'cancelled';
    declare priority: 'routine' | 'urgent' | 'emergency';
}

Referral.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    patient_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    referring_facility: {
        type: DataTypes.STRING,
        allowNull: false
    },
    receiving_facility: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    clinical_summary: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    priority: {
        type: DataTypes.ENUM('routine', 'urgent', 'emergency'),
        defaultValue: 'routine'
    }
}, {
    sequelize,
    modelName: 'Referral',
    timestamps: true
});

export default Referral;
