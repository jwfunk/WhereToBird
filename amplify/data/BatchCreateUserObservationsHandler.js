import { util } from '@aws-appsync/utils';

export function request(ctx) {
  var now = util.time.nowISO8601();

  return {
    operation: 'BatchPutItem',
    tables: {
      [`userObservations-${ctx.stash.awsAppsyncApiId}-${ctx.stash.amplifyApiEnvironmentName}`]: ctx.args.observations.map((observation) =>
        util.dynamodb.toMapValues({
          ...observation,
          id: util.autoId(),
          createdAt: now,
          updatedAt: now,
          owner: ctx.identity.sub
        })
      ),
    },
  };
}

export function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  return ctx.result.data[`userObservations-${ctx.stash.awsAppsyncApiId}-${ctx.stash.amplifyApiEnvironmentName}`];
}