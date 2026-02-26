import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

export class Encounter extends Model {
    declare id: string;
    declare patient_id: string;
    declare facility_id: string;
    declare date: Date;
    declare service_type: string;
    declare clinician_id: string;
    declare referral_status: string;
    declare data: any; // Dynamic encounter data (vitals, diagnoses, etc.)
}

Encounter.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    patient_id: { type: DataTypes.UUID, allowNull: false },
    facility_id: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    service_type: { type: DataTypes.STRING, allowNull: false },
    clinician_id: { type: DataTypes.STRING, allowNull: false },
    referral_status: { type: DataTypes.STRING },
    data: { type: DataTypes.JSONB, defaultValue: {} }
}, {
    sequelize,
    modelName: 'encounter',
    timestamps: true
});

export default Encounter;
