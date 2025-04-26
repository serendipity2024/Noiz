import { action, observable } from 'mobx';
import _ from 'lodash';
import { AllStores } from '../StoreContexts';
import StoreHelpers from '../StoreHelpers';
import GQL_DRY_RUN_PROJECT from '../../graphQL/dryRunProject';
import { FeatureType } from '../../graphQL/__generated__/globalTypes';
import { ZedSupportedPlatform } from '../../models/interfaces/ComponentModel';
import { JsErrorMessage } from '../../utils/ZTypeSystem';
import ZNotification from '../../utils/notifications/ZNotifications';
import i18n from '../../utils/notifications/ZNotifications.i18n.json';

interface ValidationMessage {
  mRef: string;
  message: string;
}

export class DryRunStore {
  @observable
  isRunning = false;

  @observable
  validationErrors: ValidationMessage[] = [];

  @observable
  validationWarnings: ValidationMessage[] = [];

  public get isCleanCompile(): boolean {
    return !this.validationErrors.length && !this.validationWarnings.length;
  }

  public async executeDryRun(projectExId: string): Promise<void> {
    const { coreStore, sessionStore, featureStore, typeSystemStore, persistedStore } = AllStores;
    const notif = new ZNotification(i18n[persistedStore.locale]);
    this.isRunning = true;

    try {
      StoreHelpers.generateAllComponentLayoutData();
      const dryRunRequest = sessionStore.clientForSession.mutate({
        mutation: GQL_DRY_RUN_PROJECT,
        variables: {
          appSchema: coreStore,
          buildTarget: this.getCurrentBuildTarget(),
          projectExId,
        },
      });

      const { stableErrors, betaErrors } = typeSystemStore.validated;
      const validationResult = featureStore.isFeatureAccessible(FeatureType.SCHEMA_VALIDATION)
        ? { stableErrors, betaErrors }
        : { stableErrors: [], betaErrors: stableErrors.concat(betaErrors) };

      const formattedErrors = this.formatTypeSystemMessage(validationResult.stableErrors);
      const formattedWarnings = this.formatTypeSystemMessage(validationResult.betaErrors);

      const dryRunResult = (await dryRunRequest).data.dryRun;
      const dryRunErrors = dryRunResult.succeed ? [] : dryRunResult.result;

      this.onValidationResults(formattedErrors.concat(dryRunErrors), formattedWarnings);

      if (!this.validationErrors.length) {
        notif.send('PROJECT_CHECK_SUCCESS');
      }
    } catch (err) {
      notif.send('PROJECT_CHECK_FAILURE');
    }
  }

  @action
  private onValidationResults(errors: ValidationMessage[], warnings: ValidationMessage[]) {
    this.validationErrors = errors;
    this.validationWarnings = warnings;
    this.isRunning = false;
  }

  private getCurrentBuildTarget() {
    const {
      editorStore: { editorPlatform },
    } = AllStores;
    switch (editorPlatform) {
      case ZedSupportedPlatform.WECHAT:
        return 'WECHAT_MINIPROGRAM';
      case ZedSupportedPlatform.MOBILE_WEB:
        return 'MOBILE_WEB';
      default:
        throw new Error(`Unsupported buildTarget, ${editorPlatform}`);
    }
  }

  private formatTypeSystemMessage(jsonErrorMessages: JsErrorMessage[]): ValidationMessage[] {
    const { persistedStore } = AllStores;
    const componentErrors = _.groupBy(jsonErrorMessages, (error): string => {
      return error.componentId;
    });
    const jsErrorList = _.map(componentErrors, (value) =>
      value.map((singleValue: JsErrorMessage): ValidationMessage => {
        return {
          mRef: singleValue.componentId,
          message: singleValue.getLocalizedErrorMessage(persistedStore.locale),
        };
      })
    ).flat();
    return jsErrorList;
  }
}
