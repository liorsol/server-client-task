import { Router } from 'express';
import * as HttpHandler from './http.handler';

export const router = Router();

router.post('/init', HttpHandler.init);