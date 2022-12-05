module.exports = {
    plans: async (req, res) => {
        let plans = [
            { type: 'FREE' },
            { type: 'ACTIVE' },
            { type: 'ENTREPRENEUR' },
            { type: 'STRENGTHENED' },
            { type: 'EMPOWERED' }
        ]
        return res.status(200).json({
            success: true,
            data: plans
        });
    }
}