import { simulateInvestment } from "../services/simulationService.js";

export const runSimulation = (req, res) => {
    try {
        const { amount, duration, investmentType } = req.body;

        // basic validation
        if (!amount || !duration || !investmentType) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const result = simulateInvestment({
            amount,
            duration,
            investmentType
        });

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};