import { ThirdPartyData, ZDataType } from '../shared/type-definition/ThirdPartyRequest';
import { OpaqueType, OpaqueTypeSerializer, TypeBuilder } from './ZTypeSystem';

export class TypeSystemHelper {
  public static genZType(currentParameter: ThirdPartyData): string | undefined {
    let opaqueType: OpaqueType | undefined;
    switch (currentParameter.type) {
      case ZDataType.OBJECT: {
        opaqueType = TypeSystemHelper.getObjectZType(currentParameter.parameters ?? []);
        break;
      }
      case ZDataType.ARRAY: {
        let innerType: OpaqueType | undefined;
        const itemType = currentParameter.itemType ?? ZDataType.STRING;
        if (itemType === ZDataType.OBJECT) {
          innerType = TypeSystemHelper.getObjectZType(currentParameter.parameters ?? []);
        } else {
          innerType = TypeBuilder.fromColumnType(itemType) ?? undefined;
        }
        if (innerType) {
          opaqueType = TypeBuilder.listOf(innerType);
        }
        break;
      }
      default: {
        opaqueType = TypeBuilder.fromColumnType(currentParameter.type) ?? undefined;
        break;
      }
    }
    return opaqueType ? OpaqueTypeSerializer.encodeToString(opaqueType) : undefined;
  }

  private static getObjectZType(parameters: ThirdPartyData[]): OpaqueType {
    const typeObject = TypeBuilder.newObject();
    parameters.forEach((pa) => {
      if (pa.zType) {
        typeObject.withField(pa.name, OpaqueTypeSerializer.decodeFromString(pa.zType));
      } else {
        throw new Error(`param zType is undefined, ${pa}`);
      }
    });
    return typeObject.build();
  }
}
