import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import destinationsRouter from "./destinations";
import tripsRouter from "./trips";
import aiRouter from "./ai";
import weatherRouter from "./weather";
import dashboardRouter from "./dashboard";
import bookingsRouter from "./bookings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(destinationsRouter);
router.use(tripsRouter);
router.use(aiRouter);
router.use(weatherRouter);
router.use(dashboardRouter);
router.use(bookingsRouter);

export default router;
