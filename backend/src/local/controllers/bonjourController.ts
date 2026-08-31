import { Request, Response } from 'express';
import { bonjourService } from '../services/bonjourService';

export class BonjourController {
    async emit(req: Request, res: Response): Promise<void> {
        try {
            const { userId, port } = req.body;
            await bonjourService.emit(userId, port);
            res.status(201).json({ success: true, message: 'ProjecBonjour service publishedly' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
        }
    }

    async listen(req: Request, res: Response): Promise<void> {
        try {
            bonjourService.listen();
            const admins = bonjourService.getAdmins()
            res.status(201).json({ success: true, body: admins });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
        }
    }

    async unpublish(req: Request, res: Response): Promise<void> {
        try {
            bonjourService.unpublish();
            res.status(201).json({ success: true, message: "Bonjour service unpublished"  });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
        }
    }
}

export const bonjourController = new BonjourController();