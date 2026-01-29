import { supabase } from '../supabaseClient';
import { mockDataService } from './mockData';

/**
 * Service to handle interactions with the Supabase database.
 * This abstracts the database logic from the React components.
 * 
 * Supports a "Demo Mode" toggled via localStorage.
 */

const isDemoMode = () => {
    return localStorage.getItem('useDemoMode') === 'true';
};

export const heatPumpService = {
    /**
     * Fetch all heatpumps for the dashboard.
     */
    async getAllHeatPumps() {
        if (isDemoMode()) {
            console.log("⚠️ Serving Demo Data: getAllHeatPumps");
            return mockDataService.getAllHeatPumps();
        }

        if (!supabase) throw new Error("Supabase is not configured. Please check your .env.local file.");
        const { data, error } = await supabase
            .from('heatpumps')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;
        return data;
    },

    /**
     * Fetch a single heatpump by ID, including its recent measurements.
     * @param {string|number} id 
     */
    async getHeatPumpById(id) {
        if (isDemoMode()) {
            console.log("⚠️ Serving Demo Data: getHeatPumpById", id);
            return mockDataService.getHeatPumpById(id);
        }

        if (!supabase) throw new Error("Supabase is not configured. Please check your .env.local file.");
        
        const { data: heatpump, error: heatpumpError } = await supabase
            .from('heatpumps')
            .select('*')
            .eq('id', id)
            .single();

        if (heatpumpError) throw heatpumpError;

        // Fetch measurements (graphs)
        const { data: measurements, error: measurementsError } = await supabase
            .from('measurements')
            .select('status, temperatuur, druk, vermogen, created_at')
            .eq('pump_id', id)
            .order('created_at', { ascending: true })
            .limit(50);

        if (measurementsError) throw measurementsError;

        // Fetch fault history (logs)
        const { data: faults, error: faultsError } = await supabase
            .from('fault_history')
            .select('*')
            .eq('pump_id', id)
            .order('date', { ascending: false });

        if (faultsError) {
            console.warn("Could not fetch fault history:", faultsError);
        }
        
        return {
            ...heatpump,
            logs: faults || [], // Attach to the object as 'logs'
            warmtepompData: measurements.map(m => ({
                ...m,
                datum: new Date(m.created_at).toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit' }),
                original_timestamp: m.created_at
            }))
        };
    },

    /**
     * Fetch historical measurements for a heatpump based on time range.
     * @param {string|number} id 
     * @param {string} range '24h', '7d', '30d'
     */
    async getHeatPumpHistory(id, range) {
        if (isDemoMode()) {
            console.log("⚠️ Serving Demo Data: getHeatPumpHistory", range);
            return mockDataService.getHeatPumpHistory(id, range);
        }

        if (!supabase) throw new Error("Supabase is not configured.");

        let startDate = new Date();
        if (range === '7d') startDate.setDate(startDate.getDate() - 7);
        else if (range === '30d') startDate.setDate(startDate.getDate() - 30);
        else startDate.setDate(startDate.getDate() - 1); // Default to 24h

        const { data, error } = await supabase
            .from('measurements')
            .select('created_at, temperatuur, druk, status')
            .eq('pump_id', id)
            .gte('created_at', startDate.toISOString())
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data.map(m => ({
            ...m,
            original_timestamp: m.created_at
        }));
    },

    /**
     * Update settings for a heatpump.
     * This updates the 'settings' JSONB column.
     * @param {string|number} id 
     * @param {object} newSettings 
     */
    async updateSettings(id, newSettings) {
        if (!supabase) throw new Error("Supabase is not configured. Please check your .env.local file.");
        const { data, error } = await supabase
            .from('heatpumps')
            .update({ settings: newSettings })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    },

    /**
     * Subscribe to real-time updates for the heatpumps table.
     * @param {function} onUpdate - Callback function when an update occurs
     */
    subscribeToHeatPumps(onUpdate) {
        if (!supabase) return null;

        return supabase
            .channel('heatpumps-dashboard')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'heatpumps' },
                (payload) => {
                    onUpdate(payload);
                }
            )
            .subscribe();
    },

    unsubscribe(channel) {
        if (!supabase) return;
        supabase.removeChannel(channel);
    }
};
