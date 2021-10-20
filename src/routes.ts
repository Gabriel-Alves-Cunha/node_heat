import { Router } from "express";

import { GetLast3MessagesController } from "./controllers/GetLast3MessagesController";
import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { ensureUserIsAuthenticated } from "./middleware/ensureUserIsAuthenticated";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { ProfileUserController } from "./controllers/ProfileUserController";

export const router = Router();

router.post("/authenticate", new AuthenticateUserController().handle);

router.post(
	"/messages",
	ensureUserIsAuthenticated,
	new CreateMessageController().handle
);

router.get("/messages/last3", new GetLast3MessagesController().handle);

router.get(
	"/profile",
	ensureUserIsAuthenticated,
	new ProfileUserController().handle
);
