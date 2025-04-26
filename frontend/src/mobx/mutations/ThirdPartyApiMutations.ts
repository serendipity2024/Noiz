import uniqid from 'uniqid';
import { SchemaMutator } from './SchemaMutator';
import { ShortId } from '../../shared/type-definition/ZTypes';
import {
  ThirdPartyRequest,
  ThirdPartyRequestMethod,
} from '../../shared/type-definition/ThirdPartyRequest';

export class ThirdPartyApiMutations {
  constructor(private mutator: SchemaMutator) {}

  public addThirdPartyRequest(): void {
    const id = uniqid.process();
    const thirdPartyApiConfig: ThirdPartyRequest = {
      id,
      name: id,
      url: 'www.demo.com/api',
      method: ThirdPartyRequestMethod.GET,
      parameters: [],
      response: {
        successResponse: {
          statusCode: '2xx',
        },
        temporaryFailResponse: {
          statusCode: '4xx',
        },
        permanentFailResponse: {
          statusCode: '5xx',
        },
      },
    };
    this.applyThirdPartyApiConfigUpdate({ $push: [thirdPartyApiConfig] });
  }

  public deleteThirdPartyRequest(id: ShortId): void {
    this.applyThirdPartyApiConfigUpdate({
      $apply: (thirdPartyApiConfigs: ThirdPartyRequest[]) =>
        thirdPartyApiConfigs.filter((tpr) => tpr.id !== id),
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public updateThirdPartyRequest(id: ShortId, key: keyof ThirdPartyRequest, value: any): void {
    this.applyThirdPartyApiConfigUpdate({
      $apply: (thirdPartyApiConfigs: ThirdPartyRequest[]) =>
        thirdPartyApiConfigs.map((tpr) => ({
          ...tpr,
          [key]: tpr.id === id ? value : tpr[key],
        })),
    });
  }

  private applyThirdPartyApiConfigUpdate<T>(updateObj: T) {
    this.mutator.applyUpdate({ thirdPartyApiConfigs: updateObj });
  }
}
