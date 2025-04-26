/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export interface UserData {
  username: string;
  token: string;
  roleNames: string[];
}

export default class User {
  constructor(data: UserData) {
    Object.assign(this, data);
  }

  public static buildFromUserData(data: UserData): User {
    if (!data?.username) throw new Error('invalid user data!');
    return new User(data);
  }

  public username?: string;

  public profileImageUrl?: string;

  public token?: string;

  public roleNames?: string[];

  public toJSONString(): string {
    return JSON.stringify(this);
  }

  public static deserialize(json?: string): User | undefined {
    if (!json) {
      return undefined;
    }
    const obj = JSON.parse(json);
    if (obj.username.length) {
      return new User(obj);
    }
    return undefined;
  }
}
