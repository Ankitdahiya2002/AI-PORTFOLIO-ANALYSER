import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // CORS headers so the HTML page can call this endpoint
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        const { holdings, fileName } = req.body;

        if (!holdings || !Array.isArray(holdings) || holdings.length === 0) {
            return res.status(400).json({ error: 'No holdings data provided' });
        }

        const uploadId = crypto.randomUUID();
        const uploadedAt = new Date().toISOString();

        const rows = holdings.map(h => ({
            upload_id:     uploadId,
            uploaded_at:   uploadedAt,
            file_name:     fileName || 'unknown',
            symbol:        h.symbol,
            quantity:      h.qty,
            avg_price:     h.avg,
            ltp:           h.ltp,
            current_value: h.val,
            pnl:           h.pnl,
            sector:        h.sector    || null,
            asset_class:   h.asset     || null,
            market_cap:    h.marketCap || null,
            beta:          h.beta      || null,
            pe_ratio:      h.pe        || null,
            data_source:   h.dataSource || null
        }));

        const { error } = await supabase.from('portfolio_uploads').insert(rows);

        if (error) {
            console.error('Supabase error:', error.message);
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ success: true, saved: rows.length, upload_id: uploadId });

    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
