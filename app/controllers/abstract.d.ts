import { Request, Response } from 'express';
export declare class AbstractController {
    static _m(modelName: string): Promise<import("mongoose").Model<any, unknown, unknown, unknown, any, any>>;
    static _body(request: Request): any;
    static _host(request: Request): {
        actorCategory: string;
        actorId: number;
        actorAddress: string;
    };
    static _query(req: Request): import("qs").ParsedQs;
    static _errorDetails(details: any): string;
    static _notFound(res: Response, details: any): Response<any, Record<string, any>>;
    static _badRequest(res: Response, details: any): Response<any, Record<string, any>>;
    static _internalProblem(res: Response, details: any): Response<any, Record<string, any>>;
    static _notAuthenticated(res: Response, details: any): Response<any, Record<string, any>>;
    static _notAuthorized(res: Response, details: any): Response<any, Record<string, any>>;
}
