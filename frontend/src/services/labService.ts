import db from '../db';

export interface LabTest {
    _id: string;
    _rev?: string;
    type: 'lab_result';
    patient_id: string;
    patient_name: string;
    test_name: string;
    requested_by: string;
    status: 'pending' | 'completed';
    result?: string;
    created_at: string;
    completed_at?: string;
}

const todayStr = () => new Date().toISOString().slice(0, 10);

export const getPendingLabTests = async (): Promise<LabTest[]> => {
    try {
        const result = await db.find({ selector: { type: 'lab_result', status: 'pending' } });
        return (result.docs as unknown as LabTest[]).sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
    } catch (err) {
        console.error('[labService] getPendingLabTests failed:', err);
        return [];
    }
};

export const getCompletedLabTests = async (): Promise<LabTest[]> => {
    try {
        const today = todayStr();
        const result = await db.find({
            selector: { type: 'lab_result', status: 'completed', completed_at: { $gte: today } },
            limit: 30,
        });
        return (result.docs as unknown as LabTest[]).sort(
            (a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime(),
        );
    } catch (err) {
        console.error('[labService] getCompletedLabTests failed:', err);
        return [];
    }
};

export const getAllLabTestsThisMonth = async (): Promise<LabTest[]> => {
    try {
        const monthStart = `${new Date().toISOString().slice(0, 7)}-01`;
        const result = await db.find({
            selector: { type: 'lab_result', created_at: { $gte: monthStart } },
        });
        return result.docs as unknown as LabTest[];
    } catch (err) {
        console.error('[labService] getAllLabTestsThisMonth failed:', err);
        return [];
    }
};

export const createLabTest = async (
    data: Pick<LabTest, 'patient_id' | 'patient_name' | 'test_name' | 'requested_by'>,
): Promise<LabTest> => {
    const doc: LabTest = {
        _id: `LAB-${Date.now()}`,
        type: 'lab_result',
        status: 'pending',
        created_at: new Date().toISOString(),
        ...data,
    };
    await db.put(doc);
    return doc;
};

export const completeLabTest = async (test: LabTest, result: string): Promise<void> => {
    await db.put({
        ...test,
        status: 'completed',
        result,
        completed_at: new Date().toISOString(),
    });
};
