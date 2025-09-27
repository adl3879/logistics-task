import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';
import deliveryRoutes from './routes/deliveries';
import adminRoutes from './routes/admin';
import pool from './utils/database';
import "./utils/db-schema";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

(async function() {
  try{
    let client = await pool.connect();
    client.release();
    console.log("db: conn successful");
  } catch (err) {
    console.log("db: error");
  }
})();

app.use('/api/auth', authRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});