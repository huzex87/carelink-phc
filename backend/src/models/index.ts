import sequelize from '../config/database.js';
import Patient from './patient.js';
import Encounter from './encounter.js';
import LabResult from './lab_result.js';
import Referral from './referral.js';
import { InventoryItem, Prescription } from './pharmacy.js';

// Define Associations
Patient.hasMany(Encounter, { foreignKey: 'patient_id' });
Encounter.belongsTo(Patient, { foreignKey: 'patient_id' });

Patient.hasMany(LabResult, { foreignKey: 'patient_id' });
LabResult.belongsTo(Patient, { foreignKey: 'patient_id' });

Patient.hasMany(Referral, { foreignKey: 'patient_id' });
Referral.belongsTo(Patient, { foreignKey: 'patient_id' });

Patient.hasMany(Prescription, { foreignKey: 'patient_id' });
Prescription.belongsTo(Patient, { foreignKey: 'patient_id' });

export {
    sequelize,
    Patient,
    Encounter,
    LabResult,
    Referral,
    InventoryItem,
    Prescription
};
