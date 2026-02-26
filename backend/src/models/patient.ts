import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

export class Patient extends Model {
    declare id: string;
    declare facility_id: string;
    declare unique_id: string;
    declare name: string;
    declare sex: 'M' | 'F';
    declare dob: string;
    declare phone: string;
    declare ward: string;
    declare lga: string;
}

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
}, {
    sequelize,
    modelName: 'patient',
    timestamps: true,
    paranoid: true
});

export default Patient;
