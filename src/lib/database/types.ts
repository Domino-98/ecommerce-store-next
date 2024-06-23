import type { BuildQueryResult, DBQueryConfig, ExtractTablesWithRelations } from 'drizzle-orm';
import * as schema from './schema';

export type DrizzleError = {
    message: string;
    code?: string;
    stack?: string;
}

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
    'one' | 'many',
    boolean,
    TSchema,
    TSchema[TableName]
>['with'];

export type InferResultType<
    TableName extends keyof TSchema,
    With extends IncludeRelation<TableName> | undefined = undefined
> = BuildQueryResult<
    TSchema,
    TSchema[TableName],
    {
        with: With;
    }
>;

export type Category = InferResultType<'categoryTable'>

export type CategoryWithParent = InferResultType<'categoryTable', { parent: true }>