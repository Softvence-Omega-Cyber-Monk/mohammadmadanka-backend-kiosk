// routes/printData.route.ts

// import { redirectToAuth, handleAuthCallback } from ".";
import { Router } from 'express';
import { handleAuthCallback, redirectToAuth } from './auth.controller';

const EpsonRoute = Router();



EpsonRoute.get('/auth', redirectToAuth); // Redirect the user to Epson's authorization page
EpsonRoute.get('/auth/callback', handleAuthCallback); // Handle the callback from Epson

export default EpsonRoute;





