
import request from 'supertest';
import express, { NextFunction, Request, Response} from 'express';
import deliveryRoutes from '../routes/deliveries';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const app = express();
app.use(express.json());

// Mock middleware
const mockAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  req.user = { id: 1, email: 'test@example.com', role: 'CUSTOMER' };
  next();
};

app.use(mockAuthenticate);
app.use('/api/deliveries', deliveryRoutes);

describe('Delivery Routes', () => {
  it('should create a new delivery for a customer', async () => {
    const res = await request(app)
      .post('/api/deliveries')
      .send({
        pickupAddress: '123 Main St',
        deliveryAddress: '456 Oak Ave',
        packageDescription: 'A box',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toEqual('PENDING');
  });

  it('should get all deliveries for an admin', async () => {
    const mockAdminAuthenticate = (req: Request, res: Response, next: NextFunction) => {
      req.user = { id: 2, email: 'admin@example.com', role: 'ADMIN' };
      next();
    };
    app.use(mockAdminAuthenticate);

    const res = await request(app).get('/api/deliveries');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get a specific delivery by id', async () => {
    const res = await request(app).get('/api/deliveries/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
  });

  it('should update a delivery', async () => {
    const res = await request(app)
      .put('/api/deliveries/1')
      .send({
        pickupAddress: 'New Pickup Address',
        deliveryAddress: 'New Delivery Address',
        packageDescription: 'Updated Package',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.pickupAddress).toEqual('New Pickup Address');
  });

  it('should delete a delivery', async () => {
    const res = await request(app).delete('/api/deliveries/1');
    expect(res.statusCode).toEqual(204);
  });

  it('should assign a driver to a delivery', async () => {
    const mockAdminAuthenticate = (req: Request, res: Response, next: NextFunction) => {
      req.user = { id: 2, email: 'admin@example.com', role: 'ADMIN' };
      next();
    };
    app.use(mockAdminAuthenticate);

    const res = await request(app)
      .put('/api/deliveries/1/assign')
      .send({ driverId: 3 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.driver_id).toEqual(3);
  });

  it('should update the delivery status', async () => {
    const mockDriverAuthenticate = (req: Request, res: Response, next: NextFunction) => {
      req.user = { id: 3, email: 'driver@example.com', role: 'DRIVER' };
      next();
    };
    app.use(mockDriverAuthenticate);

    const res = await request(app)
      .put('/api/deliveries/1/status')
      .send({ status: 'IN_TRANSIT' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('IN_TRANSIT');
  });
});
