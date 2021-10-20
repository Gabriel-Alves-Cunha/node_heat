import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export function ensureUserIsAuthenticated(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authToken = req.headers.authorization;

	if (!authToken) {
		return res.status(401).json({
			errorCode: "token.invalid",
		});
	}

	const [_, token] = authToken.split(" ");

	try {
		const { sub } = verify(token as string, process.env.JWT_SECRET as string);

		req.user_id = sub as string;

		return next();
	} catch (error) {
		return res.status(401).json({
			errorCode: "token.expired",
		});
	}
}
