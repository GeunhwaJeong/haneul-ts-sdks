/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveTuple } from '../../../utils/index.js';
import { bcs } from '@haneullabs/haneul/bcs';
const $moduleName = 'haneulns::pricing_config';
export const Range = new MoveTuple({
	name: `${$moduleName}::Range`,
	fields: [bcs.u64(), bcs.u64()],
});
