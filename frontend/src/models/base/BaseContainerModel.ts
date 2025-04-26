/* eslint-disable import/no-default-export */
import { action, observable } from 'mobx';
import ComponentDiff from '../../diffs/ComponentDiff';
import StoreHelpers from '../../mobx/StoreHelpers';
import { PathComponent, VariableTable } from '../../shared/type-definition/DataBinding';
import { DiffItem } from '../../shared/type-definition/Diff';
import {
  GraphQLRequestBinding,
  CustomRequestBinding,
} from '../../shared/type-definition/EventBinding';
import { ShortId } from '../../shared/type-definition/ZTypes';
import { toModel } from '../ComponentModelBuilder';
import ContainerModel from '../interfaces/ContainerModel';
import BaseComponentModel from './BaseComponentModel';

export enum DataAccessMode {
  LOCAL = 'local',
  REMOTE = 'remote',
}
export default abstract class BaseContainerModel
  extends BaseComponentModel
  implements ContainerModel
{
  public readonly isContainer: boolean = true;

  public readonly isList: boolean = false;

  public readonly eligibleAsPasteTargetContainer: boolean = true;

  @observable
  public abstract childMRefs: ShortId[];

  // list query

  @observable
  public queries: GraphQLRequestBinding[] = [];

  @observable
  public thirdPartyQueries: CustomRequestBinding[] = [];

  @observable
  public dataPathComponents?: PathComponent[];

  @observable
  public listDataAccessMode: DataAccessMode = DataAccessMode.REMOTE;

  @observable
  public itemVariableTable: VariableTable = {};

  @action
  public removeChildByMRef(mRef: ShortId): void {
    const newChildren = this.childMRefs.filter((childMRef: ShortId) => childMRef !== mRef);
    this.childMRefs = newChildren;
  }

  public defaultCreateCopy(parentMRef?: ShortId): BaseContainerModel | null {
    if (!this.canCopy()) return null;

    const clone = super.defaultCreateCopy(parentMRef) as BaseContainerModel;
    clone.childMRefs = [];

    if (clone.isList && super.imperfectCopy(this.parentMRef, parentMRef)) {
      clone.queries = [];
      clone.thirdPartyQueries = [];
      clone.dataPathComponents = undefined;
      clone.itemVariableTable = {};
    }

    if (!this.isTemplate) {
      this.children().forEach((m) => {
        const child = m.createCopy(clone.mRef);
        if (child) clone.unsavedChildren.push(child);
      });
    }

    return clone;
  }

  // for in-memory creation
  @observable
  public unsavedChildren: BaseComponentModel[] = [];

  @action
  public onCreateComponentDiffs(): DiffItem[] {
    const superDiffs = super.onCreateComponentDiffs();
    superDiffs.shift();

    const childDiffs: DiffItem[] = [];
    this.unsavedChildren.forEach((m) => {
      this.childMRefs.push(m.mRef);
      toModel(m)
        .onCreateComponentDiffs()
        .forEach((di) => childDiffs.push(di));
    });
    this.unsavedChildren = [];
    this.updatedAtValue = new Date().valueOf();

    return [ComponentDiff.buildAddComponentDiff(this), ...superDiffs, ...childDiffs];
  }

  @action
  public save(type: 'unshift' | 'push' = 'push'): void {
    this.unsavedChildren.forEach((m) => {
      toModel(m).save();
      if (type === 'unshift') {
        this.childMRefs.unshift(m.mRef);
      } else {
        this.childMRefs.push(m.mRef);
      }
    });
    this.unsavedChildren = [];

    super.save();
  }

  public children(): BaseComponentModel[] {
    const result: BaseComponentModel[] = [];
    this.childMRefs.forEach((mRef: ShortId) => {
      const model = StoreHelpers.getComponentModel(mRef);
      if (model) result.push(model);
    });
    return result;
  }
}
