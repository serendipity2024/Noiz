import ztype from '@functorz/ztype';

export const { ZTypeSystem, ValidationResults } = ztype.com.functorz.ztype;
export const { DiffValidator } = ztype.com.functorz.ztype.validation;
export const { TypeBuilder, OpaqueTypeSerializer } = ztype.com.functorz.ztype.types;

export type ValidationResults = ztype.com.functorz.ztype.ValidationResults;
export type OpaqueLiveSchema = ztype.com.functorz.ztype.OpaqueLiveSchema;
export type OpaqueAppSchema = ztype.com.functorz.ztype.OpaqueAppSchema;
export type JsErrorMessage = ztype.com.functorz.ztype.JsErrorMessage;
export type DiffValidationMessage = ztype.com.functorz.ztype.validation.DiffValidationMessage;
export type OpaqueType = ztype.com.functorz.ztype.types.OpaqueType;
