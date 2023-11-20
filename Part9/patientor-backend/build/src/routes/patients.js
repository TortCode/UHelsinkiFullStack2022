"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patientsService_1 = __importDefault(require("../services/patientsService"));
const router = express_1.default.Router();
router.get('/', (_req, res) => {
    const patients = patientsService_1.default.getPatientsWithoutSSN();
    res.json(patients);
});
router.post('/', (req, res) => {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientsService_1.default.addPatient(newPatient);
    res.status(201).json(addedPatient);
});
exports.default = router;
