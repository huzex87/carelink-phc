import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

export class LabResult extends Model {
    declare id: string;
    declare patient_id: string;
    declare test_type: string;
    declare result_value: string;
    declare result_unit: string;
    declare status: 'pending' | 'completed' | 'verified';
    declare requested_by: string;
}

LabResult.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    patient_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    test_type: {
        type: DataTypes.STRING, // e.g., Malaria RDT, Hb, HIV
        allowNull: false
    },
    result_value: {
        type: DataTypes.STRING,
        allowNull: true
    },
    result_unit: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'verified'),
        defaultValue: 'pending'
    },
    requested_by: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'LabResult'
});

export default LabResult;
