import { Injectable } from './injectable'

export const TOKEN_ACCESSOR_KEY = '@injectable-ts/core//TOKEN_ACCESSOR'

export interface TokenAccessor {
  <Name extends PropertyKey, Dependencies extends Record<Name, unknown>>(
    dependencies: Dependencies,
    name: Name
  ): Dependencies[Name]
}

export function token<Name extends PropertyKey>(
  name: Name
): <Type = never>() => Type extends undefined
  ? { error: `${Name extends string ? `'${Name}' token ` : ''}cannot use 'undefined' as type` }
  : Injectable<
      {
        readonly name: Name
        readonly type: Type
        readonly optional: false
        readonly children: readonly [
          {
            readonly name: typeof TOKEN_ACCESSOR_KEY
            readonly type: TokenAccessor
            readonly optional: true
            readonly children: readonly []
          }
        ]
      },
      Type
    >
export function token(name: PropertyKey) {
  return (): Injectable<
    {
      readonly name: PropertyKey
      readonly type: unknown
      readonly optional: false
      readonly children: readonly [
        {
          readonly name: typeof TOKEN_ACCESSOR_KEY
          readonly type: TokenAccessor
          readonly optional: true
          readonly children: readonly []
        }
      ]
    },
    unknown
  > => {
    return (dependencies) => {
      const accessor = dependencies[TOKEN_ACCESSOR_KEY]
      return accessor ? accessor(dependencies, name) : dependencies[name]
    }
  }
}
