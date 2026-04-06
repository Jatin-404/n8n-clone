import { Config, Env, Nested } from '../decorators';

@Config
class PostHogConfig {
	/** PostHog project API key for product analytics. */
	@Env('N8N_DIAGNOSTICS_POSTHOG_API_KEY')
	apiKey: string = 'phc_4URIAm1uYfJO7j8kWSe0J8lc8IqnstRLS7Jx8NcakHo';

	/** PostHog API host URL. */
	@Env('N8N_DIAGNOSTICS_POSTHOG_API_HOST')
	apiHost: string = 'https://us.i.posthog.com';
}

@Config
export class DiagnosticsConfig {
	/** Whether anonymous diagnostics and telemetry are enabled for this instance. */
	@Env('N8N_DIAGNOSTICS_ENABLED')
	enabled: boolean = false;

	/** Telemetry endpoint config for the frontend (format: key;baseUrl). */
	@Env('N8N_DIAGNOSTICS_CONFIG_FRONTEND')
	frontendConfig: string = '';

	/** Telemetry endpoint config for the backend (format: key;baseUrl). */
	@Env('N8N_DIAGNOSTICS_CONFIG_BACKEND')
	backendConfig: string = '';

	@Nested
	posthogConfig: PostHogConfig;
}
