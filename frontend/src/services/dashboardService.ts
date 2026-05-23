import db from '../db';

export interface DashboardStats {
    todayWaiting: number;
    inProgress: number;
    completed: number;
    referred: number;
    labPending: number;
    rxPending: number;
    lowStock: number;
    totalPatients: number;
    appointmentsToday: number;
    awaitingCheckIn: number;
    noShows: number;
    totalAppointments: number;
    inpatients: number;
    bedsAvailable: number;
    admissionsToday: number;
    dischargesToday: number;
}

export interface PerformanceMetric {
    label: string;
    icon: string;
    value: number;
    target: number;
}

export interface QueueEntry {
    id: string;
    number: number;
    patientName: string;
    patientId: string;
    ageInfo: string;
    station: string;
    priority: 'Emergency' | 'Urgent' | 'Normal' | 'Child Health';
    status: 'Waiting' | 'In Progress' | 'Completed' | 'Admitted';
    timeAgo: string;
}

const todayStr = () => new Date().toISOString().slice(0, 10);
const thisMonthStr = () => new Date().toISOString().slice(0, 7);

function formatTimeAgo(isoString: string): string {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min${mins !== 1 ? 's' : ''} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
    return `${Math.floor(hrs / 24)} day(s) ago`;
}

// Maps service_type to a human-readable station name
function serviceTypeToStation(serviceType: string): string {
    const map: Record<string, string> = {
        OPD: 'Consultation',
        ANC: 'Antenatal',
        IMM: 'Immunization',
        NCD: 'NCD Clinic',
        REF: 'Referral',
        DELIVERY: 'Labour Ward',
        LAB: 'Laboratory',
    };
    return map[serviceType] || serviceType || 'Consultation';
}

const ZERO_STATS: DashboardStats = {
    todayWaiting: 0, inProgress: 0, completed: 0, referred: 0,
    labPending: 0, rxPending: 0, lowStock: 0, totalPatients: 0,
    appointmentsToday: 0, awaitingCheckIn: 0, noShows: 0, totalAppointments: 0,
    inpatients: 0, bedsAvailable: 20, admissionsToday: 0, dischargesToday: 0,
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
    try {
        const today = todayStr();
        // encounters use created_at (ISO string); filtering with >= today works lexicographically
        const [patients, todayEnc, allEnc, labs, pharmacy] = await Promise.all([
            db.find({ selector: { type: 'patient' } }),
            db.find({ selector: { type: 'encounter', created_at: { $gte: today } } }),
            db.find({ selector: { type: 'encounter' } }),
            db.find({ selector: { type: 'lab_result', status: 'pending' } }),
            db.find({ selector: { type: 'pharmacy_item' } }),
        ]);

        const enc = todayEnc.docs as any[];
        const all = allEnc.docs as any[];
        const pharm = pharmacy.docs as any[];

        return {
            totalPatients: patients.docs.length,
            // queue_status is set when encounters have explicit status; default to "in_progress"
            todayWaiting: enc.filter(e => e.queue_status === 'waiting').length,
            inProgress: enc.filter(e => !e.queue_status || e.queue_status === 'in_progress').length,
            completed: enc.filter(e => e.queue_status === 'completed').length,
            referred: enc.filter(e => e.referred === true || (e.data && e.data.referral)).length,
            labPending: labs.docs.length,
            rxPending: enc.filter(e => e.rx_status === 'pending').length,
            lowStock: pharm.filter(p => (p.quantity ?? 0) <= (p.reorder_level ?? 10)).length,
            appointmentsToday: all.filter(a => a.service_type === 'APPOINTMENT' && a.created_at?.startsWith(today)).length,
            awaitingCheckIn: 0,
            noShows: all.filter(a => a.queue_status === 'no_show' && a.created_at?.startsWith(today)).length,
            totalAppointments: all.filter(a => a.service_type === 'APPOINTMENT').length,
            inpatients: all.filter(e => e.admission_status === 'admitted').length,
            bedsAvailable: 20,
            admissionsToday: all.filter(e => e.admission_status === 'admitted' && e.created_at?.startsWith(today)).length,
            dischargesToday: all.filter(e => e.discharge_date?.startsWith(today)).length,
        };
    } catch (err) {
        console.error('[dashboardService] getDashboardStats failed:', err);
        return ZERO_STATS;
    }
};

export const getMonthlyPerformance = async (): Promise<PerformanceMetric[]> => {
    try {
        const monthStart = `${thisMonthStr()}-01`;
        const result = await db.find({
            selector: { type: 'encounter', created_at: { $gte: monthStart } },
        });
        const enc = result.docs as any[];

        return [
            { label: 'OPD Visits',      icon: 'opd', value: enc.filter(e => e.service_type === 'OPD').length,                                  target: 500 },
            { label: 'ANC Visits',      icon: 'anc', value: enc.filter(e => e.service_type === 'ANC').length,                                  target: 100 },
            { label: 'Immunizations',   icon: 'imm', value: enc.filter(e => e.service_type === 'IMM').length,                                  target: 200 },
            { label: 'Lab Tests',       icon: 'lab', value: enc.filter(e => e.service_type === 'LAB' || e.has_lab === true).length,            target: 150 },
            { label: 'Deliveries',      icon: 'del', value: enc.filter(e => e.service_type === 'DELIVERY').length,                            target: 20  },
        ];
    } catch (err) {
        console.error('[dashboardService] getMonthlyPerformance failed:', err);
        return [
            { label: 'OPD Visits',    icon: 'opd', value: 0, target: 500 },
            { label: 'ANC Visits',    icon: 'anc', value: 0, target: 100 },
            { label: 'Immunizations', icon: 'imm', value: 0, target: 200 },
            { label: 'Lab Tests',     icon: 'lab', value: 0, target: 150 },
            { label: 'Deliveries',    icon: 'del', value: 0, target: 20  },
        ];
    }
};

export const getLiveQueue = async (): Promise<QueueEntry[]> => {
    try {
        const today = todayStr();
        // Fetch today's encounters
        const encResult = await db.find({
            selector: { type: 'encounter', created_at: { $gte: today } },
            limit: 25,
        });
        const encounters = encResult.docs as any[];
        if (encounters.length === 0) return [];

        // Batch-fetch patients to denormalize names
        const patientIds = [...new Set(encounters.map((e: any) => e.patient_id).filter(Boolean))];
        let patientMap: Record<string, any> = {};
        if (patientIds.length > 0) {
            const pResult = await db.find({
                selector: { type: 'patient', _id: { $in: patientIds as string[] } },
            });
            pResult.docs.forEach((p: any) => { patientMap[p._id] = p; });
        }

        const statusMap: Record<string, QueueEntry['status']> = {
            waiting: 'Waiting',
            in_progress: 'In Progress',
            completed: 'Completed',
            admitted: 'Admitted',
        };

        return encounters.map((doc: any, i: number) => {
            const patient = patientMap[doc.patient_id] || {};
            const dob = patient.dob ? new Date(patient.dob) : null;
            const age = dob ? Math.floor((Date.now() - dob.getTime()) / 31557600000) : null;
            return {
                id: doc._id,
                number: i + 1,
                patientName: patient.name || doc.patient_name || 'Unknown Patient',
                patientId: doc.patient_id || '',
                ageInfo: age != null ? `${age} yr · ${patient.sex === 'M' ? 'M' : 'F'}` : '',
                station: serviceTypeToStation(doc.service_type || ''),
                priority: (['Emergency', 'Urgent', 'Normal', 'Child Health'].includes(doc.priority) ? doc.priority : 'Normal') as QueueEntry['priority'],
                status: statusMap[doc.queue_status as string] || 'In Progress',
                timeAgo: doc.created_at ? formatTimeAgo(doc.created_at) : 'just now',
            };
        });
    } catch (err) {
        console.error('[dashboardService] getLiveQueue failed:', err);
        return [];
    }
};
