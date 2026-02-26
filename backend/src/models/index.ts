import { Sequelize, DataTypes, Model } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'carelink_phc',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'password',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false,
    }
);

export class Patient extends Model { }
Patient.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    facility_id: { type: DataTypes.STRING, allowNull: false },
    unique_id: { type: DataTypes.STRING, unique: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    sex: { type: DataTypes.ENUM('M', 'F'), allowNull: false },
    dob: { type: DataTypes.DATEONLY, allowNull: false },
    phone: { type: DataTypes.STRING },
    ward: { type: DataTypes.STRING },
    lga: { type: DataTypes.STRING },
    deleted_at: { type: DataTypes.DATE },
}, { sequelize, modelName: 'patient', timestamps: true, paranoid: true });

export class Encounter extends Model { }
Encounter.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    patient_id: { type: DataTypes.UUID, allowNull: false },
    facility_id: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    service_type: { type: DataTypes.STRING, allowNull: false },
    clinician_id: { type: DataTypes.STRING, allowNull: false },
    referral_status: { type: DataTypes.STRING },
}, { sequelize, modelName: 'encounter', timestamps: true });

export { sequelize };
