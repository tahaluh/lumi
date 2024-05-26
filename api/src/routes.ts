import { Router } from 'express';
import UserController from './components/user/UserController';
import ElectricityBillController from './components/eletricityBill/ElectricityBillController';
import SystemStatusController from './components/system-status/SystemStatusController';
import { RouteDefinition } from './types/RouteDefinition';

function registerControllerRoutes(routes: RouteDefinition[]): Router {
	const controllerRouter = Router();
	routes.forEach((route) => {
		if (!['get', 'post', 'put', 'patch', 'delete'].includes(route.method)) {
			throw new Error(`Unsupported HTTP method: ${route.method}`);
		}
		controllerRouter[route.method](route.path, route.handler);
	});
	return controllerRouter;
}

export default function registerRoutes(): Router {
	const router = Router();

	console.log('Registering routes...');

	// Define an array of controller objects
	const controllers = [new SystemStatusController(), new UserController(), new ElectricityBillController()];

	// Dynamically register routes for each controller
	controllers.forEach((controller) => {
		// make sure each controller has basePath attribute and routes() method
		router.use(
			`/v1/${controller.basePath}`,
			registerControllerRoutes(controller.routes()),
		);
	});

	return router;
}
