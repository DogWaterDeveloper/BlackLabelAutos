export async function handler(event, context) {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        // Netlify Database REST API
        const DB_URL = process.env.NETLIFY_DATABASE_URL;
        const TOKEN = process.env.NETLIFY_DATABASE_TOKEN;

        if (!DB_URL || !TOKEN) {
            throw new Error('Database credentials not configured');
        }

        // Get query parameters
        const params = event.queryStringParameters || {};
        let query = 'SELECT * FROM vehicles WHERE 1=1';
        
        // Add filters
        if (params.category && params.category !== 'all') {
            query += ` AND category = '${params.category}'`;
        }
        if (params.make && params.make !== 'all') {
            query += ` AND make = '${params.make}'`;
        }
        if (params.engine) {
            query += ` AND engine = '${params.engine}'`;
        }
        if (params.status) {
            query += ` AND status = '${params.status}'`;
        }
        if (params.search) {
            query += ` AND name LIKE '%${params.search}%'`;
        }

        // Sorting
        const sort = params.sort || 'price-desc';
        const [field, direction] = sort.split('-');
        const sortField = field === 'price' ? 'price_num' : field === 'year' ? 'year_num' : 'rating_num';
        query += ` ORDER BY ${sortField} ${direction === 'asc' ? 'ASC' : 'DESC'}`;

        // Query database
        const response = await fetch(`${DB_URL}/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error(`Database error: ${response.status}`);
        }

        const data = await response.json();

        // Transform rows to match frontend format
        const vehicles = (data.results || []).map(row => ({
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
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(vehicles),
        };
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
}
