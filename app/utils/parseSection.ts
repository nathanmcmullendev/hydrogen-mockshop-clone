import type {ParsedMetafields} from '@shopify/hydrogen';
import {parseMetafield} from '@shopify/hydrogen';

/**
 * Recursively parse metafields (objects containing a type, value and key)
 * into a more usable format. Removes nested reference and references keys.
 *
 * This utility transforms the nested GraphQL response from metaobject queries
 * into a flat, easy-to-use structure for React components.
 */
export function parseSection<InputType, ReturnType>(_section: InputType) {
  const section = liftEach(_section, [
    'reference',
    'references',
  ] as const);
  const parsed = {} as Record<string, unknown>;

  // parse each key in the section
  for (const key in section) {
    const node = section[key];
    if (typeof node === 'object') {
      // @ts-expect-error node might not have type and value properties
      const isMetafield = node?.type && node?.value;
      const isArray = Array.isArray(node);
      if (isArray) {
        parsed[key] = (node as unknown[]).map((item) => parseSection(item));
      } else if (isMetafield) {
        parsed[key] = parseMetafieldValue(node);
      } else if (node && Object.keys(node as object).length > 0) {
        parsed[key] = parseSection(node as unknown);
      } else {
        delete parsed[key];
      }
    } else {
      parsed[key] = node;
    }
  }
  return parsed as unknown as typeof section & ReturnType;
}

function parseMetafieldValue(node: Record<string, unknown>) {
  switch (node?.type) {
    case 'single_line_text_field':
      return parseMetafield<ParsedMetafields['single_line_text_field']>(
        node as Parameters<typeof parseMetafield>[0],
      );

    case 'multi_line_text_field':
      return parseMetafield<ParsedMetafields['multi_line_text_field']>(
        node as Parameters<typeof parseMetafield>[0],
      );

    case 'list.single_line_text_field':
      return parseMetafield<ParsedMetafields['list.single_line_text_field']>(
        node as Parameters<typeof parseMetafield>[0],
      );

    case 'list.collection_reference':
      return parseMetafield<ParsedMetafields['list.collection_reference']>(
        node as Parameters<typeof parseMetafield>[0],
      );

    case 'boolean':
      return {
        ...node,
        parsedValue: node.value === 'true',
      };

    case 'number_integer':
    case 'number_decimal':
      return {
        ...node,
        parsedValue: Number(node.value),
      };

    // Expand with other field types as needed
    default:
      return node;
  }
}

// Type utilities for lifting nested keys from GraphQL responses
type LiftOtherKeys<KeyToLift, Section> = KeyToLift extends keyof Section
  ? Lift<Section[KeyToLift], KeyToLift>
  : object;

type Lift<Section, KeyToLift> = Section extends object
  ? Section extends Array<infer Item>
    ? Lift<Item, KeyToLift>[]
    : {
        [P in Exclude<keyof Section, KeyToLift>]: P extends 'value'
          ? NonNullable<Lift<Section[P], KeyToLift>> | undefined
          : Lift<Section[P], KeyToLift>;
      } & LiftOtherKeys<KeyToLift, Section>
  : Section;

type LiftEach<Section, KeysToLift> = KeysToLift extends readonly [
  infer FirstKeyToLift,
  ...infer RemainingKeysToLift,
]
  ? LiftEach<Lift<Section, FirstKeyToLift>, RemainingKeysToLift>
  : Section;

/**
 * Lifts a key from an object, removing nesting.
 * e.g., { foo: { reference: { bar: 1 } } } -> { foo: { bar: 1 } }
 */
function lift<Section, KeyToRemove extends PropertyKey>(
  value: Section,
  key: KeyToRemove,
): Lift<Section, KeyToRemove> {
  const isArray = Array.isArray(value);

  function liftObject(value: Record<string, unknown>) {
    const entries = Object.entries(value)
      .filter(([prop]) => prop !== key)
      .map(([prop, val]) => {
        const liftedVal = lift(val, key);
        return [prop, liftedVal];
      });
    const target = Object.fromEntries(entries);
    const source = key in value ? lift(value[key as string], key) : {};
    const lifted = Array.isArray(source)
      ? source
      : Object.assign(target, source as object);
    return lifted;
  }

  return (
    value && typeof value === 'object'
      ? isArray
        ? (value as unknown[]).map((item) =>
            liftObject(item as Record<string, unknown>),
          )
        : liftObject(value as Record<string, unknown>)
      : value
  ) as Lift<Section, KeyToRemove>;
}

/**
 * Lifts multiple keys from an object sequentially.
 */
function liftEach<Section, KeysToRemove extends ReadonlyArray<PropertyKey>>(
  obj: Section,
  keys: KeysToRemove,
): LiftEach<Section, KeysToRemove> {
  return keys.reduce<object | Section>((result, keyToLift) => {
    return lift(result, keyToLift);
  }, obj) as LiftEach<Section, KeysToRemove>;
}
