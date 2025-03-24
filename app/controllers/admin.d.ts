import { Request, Response } from 'express';
import { AbstractController } from './abstract';
export declare class AdminController extends AbstractController {
    static getStatus(req: Request, res: Response): Promise<void>;
    static postHi(req: Request, res: Response): Promise<void>;
    static postActor(req: Request, res: Response): Promise<void>;
    static postAdvice(req: Request, res: Response): Promise<void>;
    static loadAdviceId(req: Request, res: Response, next: () => void, _id: string): Promise<void>;
    static putAdvice(req: Request, res: Response): Promise<void>;
    static getAdvices(req: Request, res: Response): Promise<void>;
    protected static Update(): Promise<string>;
}
