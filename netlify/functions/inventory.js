import { Client } from 'pg';

export async function handler(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Required for Netlify Postgres
    });

    try {
        await client.connect();

        const params = event.queryStringParameters || {};
        let whereClause = [];
        let values = [];
        let paramIndex = 1;

        if (params.category && params.category !== 'all') {
            whereClause.push(`category = $${paramIndex++}`);
            values.push(params.category);
        }
        if (params.make && params.make !== 'all') {
            whereClause.push(`make = $${paramIndex++}`);
            values.push(params.make);
        }
        if (params.engine) {
            whereClause.push(`engine = $${paramIndex++}`);
            values.push(params.engine);
        }
        if (params.status) {
            whereClause.push(`status = $${paramIndex++}`);
            values.push(params.status);
        }
        if (params.search) {
            whereClause.push(`name ILIKE $${paramIndex++}`);
            values.push(`%${params.search}%`);
        }

        let query = 'SELECT * FROM vehicles';
        if (whereClause.length > 0) {
            query += ' WHERE ' + whereClause.join(' AND ');
        }

        // Sorting
        const sort = params.sort || 'price-desc';
        const [field, direction] = sort.split('-');
        const sortField = field === 'price' ? 'price_num' : field === 'year' ? 'year_num' : 'rating_num';
        query += ` ORDER BY ${sortField} ${direction === 'asc' ? 'ASC' : 'DESC'}`;

        console.log('Query:', query, 'Values:', values);

        const result = await client.query(query, values);
        await client.end();

        const vehicles = result.rows.map(row => ({
            id: row.id,
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
        console.error('Database error:', error);
        await client.end().catch(() => {});
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
}
