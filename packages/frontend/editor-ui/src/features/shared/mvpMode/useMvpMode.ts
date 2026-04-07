import { computed } from 'vue';

import { useEnvFeatureFlag } from '@/features/shared/envFeatureFlag/useEnvFeatureFlag';

export const WORKFLOWAI_MVP_MODE_FLAG = 'WORKFLOWAI_MVP_MODE';

export const useMvpMode = () => {
	const { check } = useEnvFeatureFlag();

	const isMvpMode = computed(() => check.value(WORKFLOWAI_MVP_MODE_FLAG));

	return {
		isMvpMode,
	};
};
