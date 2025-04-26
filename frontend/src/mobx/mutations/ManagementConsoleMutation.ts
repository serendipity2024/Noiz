import uniqid from 'uniqid';
import {
  genManagementConsoleMenuItems,
  genManagementConsoleObjects,
  ObjectViewConfig,
  PrimaryMenuItem,
  SecondaryMenuItem,
} from '../../shared/type-definition/ManagementConsole';
import { DataModelRegistry } from '../../shared/type-definition/DataModelRegistry';
import { SchemaMutator } from './SchemaMutator';

export class ManagementConsoleMutation {
  constructor(private mutator: SchemaMutator) {}

  public addSecondaryMenuItem(
    primaryMenuItem: PrimaryMenuItem,
    menuItems: PrimaryMenuItem[]
  ): void {
    const dataModelRegistry = new DataModelRegistry(this.mutator.coreStore.dataModel);
    const graphQLModel = dataModelRegistry.getGraphQLModel(
      primaryMenuItem.subItems[0].dataSource.table
    );
    const newPrimaryMenuItem = {
      ...primaryMenuItem,
      subItems: [
        ...primaryMenuItem.subItems,
        {
          id: uniqid.process(),
          displayName: uniqid.process(),
          dataSource: primaryMenuItem.subItems[0].dataSource,
          filters: [],
          displayColumns:
            graphQLModel?.fields.map((field) => ({
              fieldName: field.name,
              displayName: field.name,
              type: field.type,
              itemType: field.itemType,
              nullable: field.nullable,
              isHidden: false,
              isRelation: field.isRelation ?? false,
            })) ?? [],
          actions: [],
        },
      ],
    };
    this.applyMenuItemsUpdate(newPrimaryMenuItem, menuItems);
  }

  public deleteSecondaryMenuItem(
    secondaryMenuItem: SecondaryMenuItem,
    primaryMenuItem: PrimaryMenuItem
  ): void {
    const { menuItems } = this.mutator.coreStore.mcConfiguration;
    const newPrimaryMenuItem = {
      ...primaryMenuItem,
      subItems: primaryMenuItem.subItems.filter((si) => si.id !== secondaryMenuItem.id),
    };
    this.applyMenuItemsUpdate(newPrimaryMenuItem, menuItems);
  }

  public updateSecondaryMenuItem(
    secondaryMenuItem: SecondaryMenuItem,
    primaryMenuItem: PrimaryMenuItem,
    menuItems: PrimaryMenuItem[]
  ): void {
    const newPrimaryMenuItem = {
      ...primaryMenuItem,
      subItems: primaryMenuItem.subItems.map((si) =>
        si.id === secondaryMenuItem.id ? secondaryMenuItem : si
      ),
    };
    this.applyMenuItemsUpdate(newPrimaryMenuItem, menuItems);
  }

  public updateObjectView(objectViewConfig: ObjectViewConfig, objects: ObjectViewConfig[]): void {
    this.applyDataModelObjectsUpdate(objectViewConfig, objects);
  }

  public syncManagementConsoleConfig(): void {
    const { dataModel, mcConfiguration } = this.mutator.coreStore;
    const menuItems: PrimaryMenuItem[] = genManagementConsoleMenuItems(dataModel, mcConfiguration);
    const objects: ObjectViewConfig[] = genManagementConsoleObjects(dataModel, mcConfiguration);
    this.mutator.applyUpdate(
      {
        mcConfiguration: {
          menuItems: {
            $set: menuItems,
          },
          objects: {
            $set: objects,
          },
        },
      },
      false
    );
  }

  private applyMenuItemsUpdate(
    newPrimaryMenuItem: PrimaryMenuItem,
    menuItems: PrimaryMenuItem[]
  ): void {
    this.mutator.applyUpdate({
      mcConfiguration: {
        menuItems: {
          $set: menuItems.map((mi) => (mi.id === newPrimaryMenuItem.id ? newPrimaryMenuItem : mi)),
        },
      },
    });
  }

  private applyDataModelObjectsUpdate(
    newObjectViewConfig: ObjectViewConfig,
    objects: ObjectViewConfig[]
  ): void {
    this.mutator.applyUpdate({
      mcConfiguration: {
        objects: {
          $set: objects.map((obj) =>
            obj.objectType.table === newObjectViewConfig.objectType.table
              ? newObjectViewConfig
              : obj
          ),
        },
      },
    });
  }
}
