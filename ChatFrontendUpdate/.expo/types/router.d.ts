/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `` | `/` | `/(app)` | `/(auth)` | `/(tabs)` | `/_sitemap` | `/friend` | `/login` | `/message` | `/register` | `/request` | `/settings` | `/userEdit`;
      DynamicRoutes: `/chat/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/chat/[friendId]`;
    }
  }
}
