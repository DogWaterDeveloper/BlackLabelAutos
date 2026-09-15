import { Client } from 'pg';

export async function handler(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    };

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        // Get query parameters
        const params = event.queryStringParameters || {};
        let query = 'SELECT * FROM vehicles';
        const values = [];
        const whereClause = [];

        // Build filters
        if (params.category && params.category !== 'all') {
            whereClause.push(`category = $${values.length + 1}`);
            values.push(params.category);
        }
        if (params.make && params.make !== 'all') {
            whereClause.push(`make = $${values.length + 1}`);
            values.push(params.make);
        }
        if (params.engine) {
            whereClause.push(`engine = $${values.length + 1}`);
            values.push(params.engine);
        }
        if (params.status) {
            whereClause.push(`status = $${values.length + 1}`);
            values.push(params.status);
        }
        if (params.search) {
            whereClause.push(`name ILIKE $${values.length + 1}`);
            values.push(`%${params.search}%`);
        }

        if (whereClause.length > 0) {
            query += ' WHERE ' + whereClause.join(' AND ');
        }

        // Sorting - use the actual column names from your DB
        const sort = params.sort || 'price-desc';
        const [field, direction] = sort.split('-');
        const sortField = field === 'price' ? 'price' : field === 'year' ? 'year' : 'stock_rating';
        query += ` ORDER BY ${sortField} ${direction === 'asc' ? 'ASC' : 'DESC'}`;

        const result = await client.query(query, values);
        await client.end();

        // Transform to match frontend expectations
        const vehicles = result.rows.map(row => ({
            id: row.id,
            name: row.name,
            // Format price as string with $ and commas
            price: '$' + row.price.toLocaleString(),
            priceNum: row.price,
            year: row.year.toString(),
            yearNum: row.year,
            miles: row.miles.toLocaleString(),
            rating: row.stock_rating.toString(),
            ratingNum: row.stock_rating,
            engine: row.engine,
            seats: row.seats.toString(),
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
        console.error('Database error:', error);
        try { await client.end(); } catch(e) {}
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
}
