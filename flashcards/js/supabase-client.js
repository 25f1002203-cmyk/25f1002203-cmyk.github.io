/**
 * Supabase Client Configuration
 * Handles connection to Supabase PostgreSQL database
 */

const SUPABASE_URL = 'https://cnevpevsnslzowfbfzwe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZXZwZXZzbnNsem93ZmJmendlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MjQxOTksImV4cCI6MjA4MzMwMDE5OX0.hjz9xl4E4spNTquK6UEOHVIv31SnlXI0xp7U-EKczmU';

/**
 * Supabase Client - Lightweight REST API wrapper
 * Using fetch API instead of @supabase/supabase-js to reduce dependencies
 */
class SupabaseClient {
    constructor(url, anonKey) {
        this.url = url;
        this.anonKey = anonKey;
        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`,
            'Prefer': 'return=representation'
        };
    }

    /**
     * Make authenticated request to Supabase REST API
     * @param {String} method - HTTP method
     * @param {String} table - Table name
     * @param {String} query - Query string (e.g., "?id=eq.123")
     * @param {Object} body - Request body
     * @returns {Promise} Response data
     */
    async request(method, table, query = '', body = null) {
        const url = `${this.url}/rest/v1/${table}${query}`;
        
        const options = {
            method,
            headers: this.headers
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                const error = await response.json();
                console.error('Supabase error:', error);
                throw new Error(error.message || 'Supabase request failed');
            }

            // Handle 204 No Content
            if (response.status === 204) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('Request error:', error);
            throw error;
        }
    }

    /**
     * GET - Retrieve records
     * @param {String} table - Table name
     * @param {String} query - Query parameters
     * @returns {Promise} Array of records
     */
    async select(table, query = '') {
        return this.request('GET', table, query);
    }

    /**
     * POST - Create new record
     * @param {String} table - Table name
     * @param {Object} data - Data to insert
     * @returns {Promise} Created record
     */
    async insert(table, data) {
        const result = await this.request('POST', table, '', data);
        return Array.isArray(result) ? result[0] : result;
    }

    /**
     * PATCH - Update record
     * @param {String} table - Table name
     * @param {String} query - Query filter (e.g., "?id=eq.123")
     * @param {Object} data - Data to update
     * @returns {Promise} Updated record
     */
    async update(table, query, data) {
        const result = await this.request('PATCH', table, query, data);
        return Array.isArray(result) ? result[0] : result;
    }

    /**
     * DELETE - Remove record
     * @param {String} table - Table name
     * @param {String} query - Query filter (e.g., "?id=eq.123")
     * @returns {Promise} Deleted record
     */
    async delete(table, query) {
        return this.request('DELETE', table, query);
    }
}

// Initialize Supabase client
const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test connection
async function testSupabaseConnection() {
    try {
        const result = await supabase.select('decks', '?limit=1');
        console.log('✅ Supabase connection successful');
        return true;
    } catch (error) {
        console.error('❌ Supabase connection failed:', error.message);
        return false;
    }
}

// Test connection on load
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        testSupabaseConnection().then(success => {
            if (success) {
                // Show sync indicator
                const syncIndicator = document.getElementById('syncStatus');
                if (syncIndicator) {
                    syncIndicator.textContent = '🟢 Synced';
                    syncIndicator.style.color = '#2dce89';
                }
            }
        });
    });
}

console.log('✅ Supabase client loaded');
