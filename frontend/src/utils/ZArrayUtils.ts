/* eslint-disable import/no-default-export */
export default class ZArrayUtils {
  public static removeElementByIndex(array: any[], index: number): any {
    if (index < 0 || index >= array.length)
      throw new Error('invalid index when removing element from array');

    const slice = array.splice(index, 1);
    return slice[0];
  }

  public static findIndexByElementProperty(
    array: any[],
    propertyName: string,
    expect: string
  ): number {
    let rsp = -1;
    array.forEach((item: any, index: number) => {
      if (item[propertyName] === expect) {
        rsp = index;
      }
    });
    return rsp;
  }

  public static findItemAndIndex<T>(params: {
    array: T[];
    filter: (item: T) => boolean;
  }): { item: T; index: number } | undefined {
    for (let index = 0; index < params.array.length; index++) {
      const item = params.array[index];
      if (params.filter(item)) {
        return { item, index };
      }
    }
    return undefined;
  }
}
