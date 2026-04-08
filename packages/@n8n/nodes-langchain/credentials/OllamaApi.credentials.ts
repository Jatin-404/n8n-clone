import type {
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';

export class OllamaApi implements ICredentialType {
	name = 'ollamaApi';

	displayName = 'Ollama';

	documentationUrl = 'ollama';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			required: true,
			type: 'string',
			default: 'http://127.0.0.1:11434',
		},
		{
			displayName: 'API Key',
			hint: 'When using Ollama behind a proxy with authentication (such as Open WebUI), provide the Bearer token/API key here. This is not required for the default Ollama installation',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: false,
		},
	];

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	) {
		requestOptions.headers ??= {};

		const normalizeLocalUrl = (value: string) => value.replace('://localhost', '://127.0.0.1');

		if (typeof requestOptions.baseURL === 'string') {
			requestOptions.baseURL = normalizeLocalUrl(requestOptions.baseURL);
		}

		if (typeof requestOptions.url === 'string') {
			requestOptions.url = normalizeLocalUrl(requestOptions.url);
		}

		if (typeof credentials.apiKey === 'string' && credentials.apiKey.length > 0) {
			requestOptions.headers.Authorization = `Bearer ${credentials.apiKey}`;
		}

		return requestOptions;
	}

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{ $credentials.baseUrl }}',
			url: '/api/tags',
			method: 'GET',
		},
	};
}
