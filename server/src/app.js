import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import patientRoutes from "./modules/patient/patient.routes.js";
import consultationRoutes from "./modules/consultation/consultation.routes.js";
import livekitRoutes from "./modules/livekit/livekit.routes.js";
import clinicalContextRoutes from "./modules/clinicalContext/clinicalContext.routes.js";
import doctorRoutes from "./modules/doctor/doctor.routes.js";
import clinicRoutes from "./modules/clinic/clinic.routes.js";
import timelineRoutes from "./modules/timeline/timeline.routes.js";
import healthRoutes from "./modules/health/health.routes.js";

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Auth routes registration
app.use('/api/auth', authRoutes);

// Patient routes registration
app.use('/api/patient', patientRoutes);

// Consultation routes registration
app.use('/api/consultation', consultationRoutes);

// LiveKit routes registration
app.use('/api/livekit', livekitRoutes);

// Clinical Context routes registration
app.use('/api/clinical-context', clinicalContextRoutes);

// Doctor routes registration
app.use('/api/doctor', doctorRoutes);

// Clinic routes registration
app.use('/api/clinic', clinicRoutes);

// Timeline routes registration
app.use('/api/timeline', timelineRoutes);

// Health check routes registration
app.use('/health', healthRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        "success": true,
        "message": "Cortexcare Api is running..."
    });
});

export default app;