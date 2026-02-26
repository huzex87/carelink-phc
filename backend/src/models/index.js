"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.Encounter = exports.Patient = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'carelink_phc', process.env.DB_USER || 'postgres', process.env.DB_PASSWORD || 'password', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
});
exports.sequelize = sequelize;
class Patient extends sequelize_1.Model {
}
exports.Patient = Patient;
Patient.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    facility_id: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    unique_id: { type: sequelize_1.DataTypes.STRING, unique: true, allowNull: false },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    sex: { type: sequelize_1.DataTypes.ENUM('M', 'F'), allowNull: false },
    dob: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
    phone: { type: sequelize_1.DataTypes.STRING },
    ward: { type: sequelize_1.DataTypes.STRING },
    lga: { type: sequelize_1.DataTypes.STRING },
    deleted_at: { type: sequelize_1.DataTypes.DATE },
}, { sequelize, modelName: 'patient', timestamps: true, paranoid: true });
class Encounter extends sequelize_1.Model {
}
exports.Encounter = Encounter;
Encounter.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    patient_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    facility_id: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    date: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    service_type: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    clinician_id: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    referral_status: { type: sequelize_1.DataTypes.STRING },
}, { sequelize, modelName: 'encounter', timestamps: true });
//# sourceMappingURL=index.js.map