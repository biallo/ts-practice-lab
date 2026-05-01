import type { Lesson } from "./types";
import { valuesFunctionsLesson } from "./values-functions";
import { objectsPropsLesson } from "./objects-props";
import { unionNarrowingLesson } from "./union-narrowing";
import { reactHooksLesson } from "./react-hooks";
import { unknownGenericsLesson } from "./unknown-generics";
import { interfaceVsTypeLesson } from "./interface-vs-type";
import { keyofIndexedAccessLesson } from "./keyof-indexed-access";
import { typeofAsConstLesson } from "./typeof-as-const";
import { genericConstraintsLesson } from "./generic-constraints";
import { typeGuardsLesson } from "./type-guards";
import { apiModelingLesson } from "./api-modeling";
import { satisfiesOperatorLesson } from "./satisfies-operator";
import { reactChildrenComponentPropsLesson } from "./react-children-component-props";
import { tsconfigStrictLesson } from "./tsconfig-strict";
import { conditionalTypesLesson } from "./conditional-types";
import { inferTypesLesson } from "./infer-types";
import { mappedTypesLesson } from "./mapped-types";
import { utilityTypesDeepLesson } from "./utility-types-deep";
import { discriminatedUnionsLesson } from "./discriminated-unions";
import { reactEventsFormsLesson } from "./react-events-forms";
import { typedConfigObjectsLesson } from "./typed-config-objects";
import { apiErrorModelingLesson } from "./api-error-modeling";
import { templateLiteralTypesLesson } from "./template-literal-types";
import { keyRemappingLesson } from "./key-remapping";
import { recursiveTypesLesson } from "./recursive-types";
import { deepUtilityTypesLesson } from "./deep-utility-types";
import { functionOverloadsLesson } from "./function-overloads";
import { typedEventBusLesson } from "./typed-event-bus";
import { typedRouteParamsLesson } from "./typed-route-params";
import { nestedFieldPathsLesson } from "./nested-field-paths";
import { zodRuntimeValidationLesson } from "./zod-runtime-validation";
import { typeTestsLesson } from "./type-tests";

export const lessons: Lesson[] = [
  valuesFunctionsLesson,
  objectsPropsLesson,
  unionNarrowingLesson,
  reactHooksLesson,
  unknownGenericsLesson,
  interfaceVsTypeLesson,
  keyofIndexedAccessLesson,
  typeofAsConstLesson,
  genericConstraintsLesson,
  typeGuardsLesson,
  apiModelingLesson,
  satisfiesOperatorLesson,
  reactChildrenComponentPropsLesson,
  tsconfigStrictLesson,
  conditionalTypesLesson,
  inferTypesLesson,
  mappedTypesLesson,
  utilityTypesDeepLesson,
  discriminatedUnionsLesson,
  reactEventsFormsLesson,
  typedConfigObjectsLesson,
  apiErrorModelingLesson,
  templateLiteralTypesLesson,
  keyRemappingLesson,
  recursiveTypesLesson,
  deepUtilityTypesLesson,
  functionOverloadsLesson,
  typedEventBusLesson,
  typedRouteParamsLesson,
  nestedFieldPathsLesson,
  zodRuntimeValidationLesson,
  typeTestsLesson
];
