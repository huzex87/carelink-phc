/**
 * CareLink PHC - Load & Stress Verification Script
 * Simulates high-volume clinical data entry to verify system stability.
 */

async function runLoadTest(concurrentUsers: number, rounds: number) {
    console.log(`🚀 Starting Load Test: ${concurrentUsers} users, ${rounds} rounds`);
    const startTime = Date.now();
    let successCount = 0;
    let errorCount = 0;

    const simulateUserSession = async (userIndex: number) => {
        for (let r = 0; r < rounds; r++) {
            try {
                // 1. Simulate Patient Search
                await fetch(`http://localhost:4000/api/v1/patients/search?q=Ahmad`);

                // 2. Simulate Encounter Entry
                const response = await fetch('http://localhost:4000/api/v1/encounters', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        patient_id: `LOAD-TEST-PATIENT-${userIndex}`,
                        service_type: 'OPD',
                        data: { complaint: 'Fever', diagnosis: 'Malaria' }
                    })
                });

                if (response.ok) successCount++;
                else errorCount++;
            } catch (e) {
                errorCount++;
            }
        }
    };

    const sessions = Array.from({ length: concurrentUsers }).map((_, i) => simulateUserSession(i));
    await Promise.all(sessions);

    const duration = (Date.now() - startTime) / 1000;
    console.log('\n--- Load Test Results ---');
    console.log(`⏱️ Duration: ${duration.toFixed(2)}s`);
    console.log(`✅ Successful OPS: ${successCount}`);
    console.log(`❌ Failed OPS: ${errorCount}`);
    console.log(`📊 Throughput: ${(successCount / duration).toFixed(2)} req/s`);

    if (errorCount === 0) {
        console.log('\n🌟 PERFORMANCE VERIFIED: System stable under load.');
    } else {
        console.log('\n⚠️ PERFORMANCE WARNING: Failures detected during stress test.');
    }
}

// Trigger test (Can be run via: ts-node scripts/load-test.ts)
runLoadTest(10, 50).catch(console.error);
