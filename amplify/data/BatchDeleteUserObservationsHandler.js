import { util } from '@aws-appsync/utils';

export function request(ctx) {
  return {
    operation: 'BatchDeleteItem',
    tables: {
      [`userObservations-${ctx.stash.awsAppsyncApiId}-${ctx.stash.amplifyApiEnvironmentName}`]: ctx.args.ids.map((id) =>
        util.dynamodb.toMapValues({
          id
        })
      ),
    },
  };
}

export function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  return ctx.result.data.userObservations;
}