import { Client } from 'pg';

export async function handler(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };

    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'DATABASE_URL not set' }),
        };
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('Connected!');

        // Test simple query first
        const testResult = await client.query('SELECT NOW() as time');
        console.log('Server time:', testResult.rows[0].time);

        // Check if vehicles table exists
        const tableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'vehicles'
            );
        `);
        
        const tableExists = tableCheck.rows[0].exists;
        console.log('Table exists:', tableExists);

        if (!tableExists) {
            await client.end();
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'vehicles table does not exist. Please create it first.' }),
            };
        }

        // Get vehicles
        const result = await client.query('SELECT * FROM vehicles LIMIT 5');
        console.log('Found', result.rows.length, 'vehicles');

        await client.end();

        if (result.rows.length === 0) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ error: 'No vehicles in database. Please import data.' }),
            };
        }

        // Transform data
        const vehicles = result.rows.map(row => ({
            name: row.name,
            price: row.price,
            priceNum: row.price_num,
            year: row.year,
            yearNum: row.year_num,
            miles: row.miles,
            rating: row.rating,
            ratingNum: row.rating_num,
            engine: row.engine,
            seats: row.seats,
            status: row.status,
            category: row.category,
            make: row.make,
            image: row.image,
            stats: {
                hp: `${row.stock_hp}/${row.potential_hp}`,
                speed: `${row.stock_speed}/${row.potential_speed}`,
                rating: `${row.stock_rating}/${row.potential_rating}`,
                accel: `${row.stock_accel}/${row.potential_accel}`,
                grip: `${row.stock_grip}/${row.potential_grip}`,
                platform: `${row.stock_platform}/${row.potential_platform}`,
                braking: `${row.stock_braking}/${row.potential_braking}`
            }
        }));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(vehicles),
        };

    } catch (error) {
        console.error('Error:', error);
        try { await client.end(); } catch(e) {}
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: error.message,
                hint: 'Check function logs in Netlify dashboard'
            }),
        };
    }
}
