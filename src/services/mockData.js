import { format, subMinutes, subHours, subDays } from 'date-fns';

/**
 * Service to generate realistic mock data for the dashboard.
 * Used when 'Demo Mode' is active or backend is unavailable.
 */

const FABRIKANTEN = ['Intergas', 'Remeha', 'Daikin', 'Mitsubishi', 'Nefit Bosch'];
const BEDRIJVEN = ['Jansen Installatietechniek', 'Comfort BV', 'Warmte Totaal', 'Duurzaam Wonen', 'TechExpert Zuid'];
const STATUSES = [200, 200, 200, 200, 300, 500]; // Weighted towards 200 (OK)
const MERKEN = ['Xtreme 36', 'Elga Ace', 'Altherma 3', 'Ecodan', 'Enviline'];

// Helper to get random item from array
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
// Helper for random float
const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(1);
// Helper for random int
const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

export const mockDataService = {
    /**
     * Generate 20 realistic heat pumps
     */
    async getAllHeatPumps() {
        // Simmsulate network delay
        await new Promise(resolve => setTimeout(resolve, 600));

        return Array.from({ length: 20 }, (_, i) => {
            const fabrikantIdx = randomInt(0, FABRIKANTEN.length);
            const status = random(STATUSES);
            
            return {
                id: `HP-${2024000 + i}`, // e.g., HP-2024001
                postcode: `${randomInt(1000, 9999)} ${String.fromCharCode(65+randomInt(0,26))}${String.fromCharCode(65+randomInt(0,26))}`,
                fabrikant: FABRIKANTEN[fabrikantIdx],
                merk: MERKEN[fabrikantIdx] || 'Hybrid 5kW',
                bedrijf: random(BEDRIJVEN),
                serienummer: `SN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                installatieDatum: `202${randomInt(1, 4)}-${randomInt(1, 12).toString().padStart(2, '0')}-${randomInt(1, 28).toString().padStart(2, '0')}`,
                huidigeStatus: status,
                huidigeTemperatuur: parseFloat(randomFloat(35, 65)),
                gemiddeldeDruk: parseFloat(randomFloat(1.5, 2.2)),
                vermogen: parseFloat(randomFloat(2, 6)),
                verbruik: parseFloat(randomFloat(200, 800)), // kWh
                cop: parseFloat(randomFloat(3.5, 5.2)),
                laatsteDataUpdate: new Date().toISOString(),
                error_code: status === 500 ? `E-${randomInt(100, 999)}` : null,
                error_message: status === 500 ? "Waterdruk te laag of sensor defect" : null,
                settings: {
                    targetTemp: 20,
                    mode: 'Eco'
                }
            };
        });
    },

    /**
     * Generate beautiful sine-wave history data
     */
    async getHeatPumpHistory(id, range) {
         // Simulate network delay
         await new Promise(resolve => setTimeout(resolve, 400));

         const now = new Date();
         let points = 50;
         let intervalMinutes = 30;
         
         if (range === '24h') {
            points = 48; // every 30 mins
            intervalMinutes = 30;
         } else if (range === '7d') {
            points = 84; // every 2 hours
            intervalMinutes = 120;
         } else if (range === '30d') {
            points = 90; // every 8 hours
            intervalMinutes = 480;
         }

         const data = [];
         
         // Generate sine wave pattern for "day/night" cycle
         for (let i = points; i >= 0; i--) {
             const time = subMinutes(now, i * intervalMinutes);
             const hours = time.getHours();
             
             // Base temperature curve (Higher during day, lower at night)
             // Math.sin input normalized to 0-2PI roughly matched to 24h cycle
             const cycle = (hours / 24) * 2 * Math.PI; 
             const baseTemp = 45;
             const amplitude = 15;
             const noise = Math.random() * 2;
             
             let temp = baseTemp + (Math.sin(cycle - Math.PI/2) * amplitude) + noise;
             
             // Pressure is mostly stable with slight fluctuation
             let pressure = 1.8 + (Math.random() * 0.2);
             
             // Occasional dip simulation
             if (Math.random() > 0.95) pressure -= 0.3;

             data.push({
                 created_at: time.toISOString(),
                 temperatuur: parseFloat(temp.toFixed(1)),
                 druk: parseFloat(pressure.toFixed(2)),
                 status: 200,
                 pump_id: id
             });
         }

         return data;
    },
    
    // Mimic the getById structure
    async getHeatPumpById(id) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const all = await this.getAllHeatPumps();
        const found = all.find(p => p.id === id) || all[0];
        
        // Find or generate history
        const history = await this.getHeatPumpHistory(id, '24h');
        
        return {
            ...found,
            id: id, // Ensure ID matches requested if we fell back to default
            warmtepompData: history,
            logs: [
                { date: subDays(new Date(), 2).toISOString(), status: 'Resolved', code: 'W-201', message: 'Verbinding hersteld' },
                { date: subDays(new Date(), 5).toISOString(), status: 'Active', code: 'E-504', message: 'Drukverlies gedetecteerd' }
            ]
        };
    }
};
