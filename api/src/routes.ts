import { Router } from 'express';
import UserController from './components/user/UserController';
import ElectricityBillController from './components/eletricityBill/ElectricityBillController';
import SystemStatusController from './components/system-status/SystemStatusController';
import { RouteDefinition } from './types/RouteDefinition';

function registerControllerRoutes(routes: RouteDefinition[]): Router {
	const controllerRouter = Router();
	routes.forEach((route) => {
		switch (route.method) {
			case 'get':
				controllerRouter.get(route.path, route.handler);
				break;
			case 'post':
				controllerRouter.post(route.path, route.handler);
				break;
			case 'put':
				controllerRouter.put(route.path, route.handler);
				break;
			case 'patch':
				controllerRouter.put(route.path, route.handler);
				break;
			case 'delete':
				controllerRouter.delete(route.path, route.handler);
				break;
			default:
				throw new Error(`Unsupported HTTP method: ${route.method}`);
		}
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
