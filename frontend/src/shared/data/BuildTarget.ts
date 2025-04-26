/* eslint-disable import/no-default-export */
import { BuildTarget as BuildTargetEnum } from '../../graphQL/__generated__/globalTypes';

export type BuildTarget = BuildTargetEnum;

export const defaultBuildTarget: BuildTarget[] = [BuildTargetEnum.WECHAT_MINIPROGRAM];

export default BuildTarget;