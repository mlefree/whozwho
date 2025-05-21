import { Mongoose } from 'mongoose';
import { ILogger } from 'mle-tools-node';
import { Express } from 'express';
export declare const initApp: (app: Express, mongoose: Mongoose, logger: ILogger) => Promise<void>;
