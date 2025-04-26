import { SchemaMutator } from './SchemaMutator';

export class ThemeColorMutations {
  constructor(private mutator: SchemaMutator) {}

  public setThemeColor(key: string, value: string): void {
    this.mutator.applyUpdate({ colorTheme: { [key]: { $set: value } } });
  }

  public setThemeColorLabel(key: string, value: string): void {
    this.mutator.applyUpdate({ colorThemeLabelMap: { [key]: { $set: value } } });
  }

  public deleteThemeColor(key: string): void {
    this.mutator.applyUpdate({
      colorTheme: {
        $unset: [key],
      },
      colorThemeLabelMap: {
        $unset: [key],
      },
    });
  }
}
