import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { ebirdProxy } from "../functions/ebird-proxy/resource";

// Define a custom type that mirrors the userObservations model


const schema = a.schema({
  UserObservationInput: a.customType({
  SubmissionID: a.string(),
  CommonName: a.string(),
  ScientificName: a.string(),
  Count: a.string(),
  StateProvince: a.string(),
  County: a.string(),
  LocationID: a.string(),
  Latitude: a.float(),
  Longitude: a.float(),
  Date: a.date(),
  Time: a.time()

}),
UserObservationDelete: a.customType({
  id: a.string()
}),
  userObservations: a.model({
    SubmissionID: a.string(),
    CommonName: a.string(),
    ScientificName: a.string(),
    Count: a.string(),
    StateProvince: a.string(),
    County: a.string(),
    LocationID: a.string(),
    Latitude: a.float(),
    Longitude: a.float(),
    Date: a.date(),
    Time: a.time(),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    id: a.id(),
    owner: a.string()

  }).authorization(allow => [allow.owner()]),
  getEBirdData: a
    .query()
    .arguments({
      lat: a.float().required(),
      lng: a.float().required(),
      apiKey: a.string().required(),
    })
    .returns(a.string())
    .handler(a.handler.function(ebirdProxy))
    .authorization(allow => [allow.authenticated()])
    ,
  BatchCreateUserObservations: a
    .mutation()
    .arguments({
      observations: a.ref('UserObservationInput').array().required()
    })
    .returns(a.ref('userObservations').array())
    .authorization(allow => [allow.authenticated()])
    .handler(
      a.handler.custom({
        dataSource: a.ref('userObservations'),
        entry: './BatchCreateUserObservationsHandler.js',
      })
    ),
    BatchDeleteUserObservations: a
    .mutation()
    .arguments({
      ids: a.id().array().required()
    })
    .returns(a.ref('userObservations').array())
    .authorization(allow => [allow.authenticated()])
    .handler(
      a.handler.custom({
        dataSource: a.ref('userObservations'),
        entry: './BatchDeleteUserObservationsHandler.js'
      })
    )
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});