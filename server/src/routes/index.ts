import express from 'express';
import * as AuthController from '../controllers/authController';
import * as BookingController from '../controllers/bookingController';
import * as MatchingController from '../controllers/matchingController';
import * as CarsController from '../controllers/carsController';
import * as ChargingPointsController from '../controllers/chargingPointsController';

import * as UsersController from '../controllers/usersController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Auth
router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);

// Users
router.put('/users/me/locations', authenticateToken, UsersController.updateLocations);

// Matching
router.post('/matching/search', MatchingController.findMatches);

// Bookings
router.get('/bookings', authenticateToken, BookingController.getUserBookings);
router.post('/bookings', authenticateToken, BookingController.createBooking);
router.get('/bookings/:id', authenticateToken, BookingController.getBooking);
router.patch('/bookings/:id/cancel', authenticateToken, BookingController.cancelBooking);

// Cars
router.get('/cars', CarsController.getAllCars);
router.post('/cars', authenticateToken, CarsController.createCar); // Admin only ideal, but simplified
router.delete('/cars/:id', authenticateToken, CarsController.deleteCar);

// Charging Points
router.get('/charging-points', ChargingPointsController.getAllPoints);
router.post('/charging-points', authenticateToken, ChargingPointsController.createPoint);
router.delete('/charging-points/:id', authenticateToken, ChargingPointsController.deletePoint);

export default router;
