import { prismaClient } from "../prisma";
import { io } from "../app";

export class CreateMessageService {
	async execute(text: string, user_id: string) {
		const msg = await prismaClient.message.create({
			data: {
				user_id,
				text,
			},
			include: {
				user: true,
			},
		});

		const infoWF = {
			text: msg.text,
			user_id: msg.user_id,
			created_at: msg.created_at,
			user: {
				name: msg.user.name,
				avatar_url: msg.user.avatar_url,
			},
		};

		io.emit("new_message", infoWF);

		return msg;
	}
}
