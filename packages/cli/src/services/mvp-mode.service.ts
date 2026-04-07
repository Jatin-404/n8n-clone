import { Logger } from '@n8n/backend-common';
import type { User } from '@n8n/db';
import { Service } from '@n8n/di';
import { randomUUID } from 'node:crypto';

import { OwnershipService } from './ownership.service';
import { UserService } from './user.service';

export const WORKFLOWAI_MVP_MODE_ENV = 'N8N_ENV_FEAT_WORKFLOWAI_MVP_MODE';

const MVP_OWNER_PROFILE = {
	email: 'mvp@workflowai.local',
	firstName: 'WorkflowAI',
	lastName: 'Owner',
};

@Service()
export class MvpModeService {
	private ensuredUserPromise: Promise<User | null> | null = null;

	constructor(
		private readonly logger: Logger,
		private readonly ownershipService: OwnershipService,
		private readonly userService: UserService,
	) {}

	isEnabled() {
		return process.env[WORKFLOWAI_MVP_MODE_ENV] === 'true';
	}

	async ensureSingleUser(): Promise<User | null> {
		if (!this.isEnabled()) {
			return null;
		}

		this.ensuredUserPromise ??= this.loadOrCreateSingleUser();

		return await this.ensuredUserPromise;
	}

	private async loadOrCreateSingleUser(): Promise<User> {
		if (await this.ownershipService.hasInstanceOwner()) {
			const owner = await this.ownershipService.getInstanceOwner();

			return await this.userService.findUserWithAuthIdentities(owner.id);
		}

		this.logger.info('WorkflowAI MVP mode enabled. Bootstrapping trusted single-user owner.');

		const owner = await this.ownershipService.setupOwner({
			...MVP_OWNER_PROFILE,
			password: `WorkflowAI-MVP-${randomUUID()}-Aa1`,
		});

		return await this.userService.findUserWithAuthIdentities(owner.id);
	}
}
