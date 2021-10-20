import { prismaClient } from "../prisma";
import { sign } from "jsonwebtoken";
import axios from "axios";

/**
 * Receive code(string)
 * Get access_token from Github
 * Get user info from Github
 * Verify if user exists on our DB
 * ---- YES = generate token
 * ---- NO  = Create at our DB, generate a token
 * Return the token with user info
 */

interface AccessTokenResponse {
	access_token: string;
}

interface UserResponse {
	avatar_url: string;
	login: string;
	name: string;
	id: number;
}

export class AuthenticateUserService {
	async execute(code: string) {
		// Get access_token from Github
		const url = "https://github.com/login/oauth/access_token";

		const { data: accessTokenResponse } = await axios.post<AccessTokenResponse>(
			url,
			null,
			{
				params: {
					client_secret: process.env.GITHUB_CLIENT_SECRET,
					client_id: process.env.GITHUB_CLIENT_ID,
					code,
				},
				headers: {
					Accept: "application/json",
				},
			}
		);

		const {
			data: { login, id: github_id, avatar_url, name },
		} = await axios.get<UserResponse>("https://api.github.com/user", {
			headers: {
				authorization: `Bearer ${accessTokenResponse.access_token}`,
			},
		});

		// Verify if user exists on our DB
		let user = await prismaClient.user.findFirst({
			where: {
				github_id,
			},
		});

		if (!user) {
			// Create new user at our DB
			user = await prismaClient.user.create({
				data: {
					avatar_url,
					github_id,
					login,
					name,
				},
			});
		}

		// Generate a token
		const token = sign(
			{
				user: {
					avatar_url: user.avatar_url,
					name: user.name,
					id: user.id,
				},
			},
			process.env.JWT_SECRET as string,
			{ subject: user.id, expiresIn: "1d" }
		);

		return { token, user };
	}
}
