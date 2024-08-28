/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/` | `/(app)/(tabs)` | `/(app)/(tabs)/` | `/(app)/(tabs)/friend` | `/(app)/(tabs)/message` | `/(app)/(tabs)/request` | `/(app)/(tabs)/settings` | `/(app)/friend` | `/(app)/message` | `/(app)/request` | `/(app)/settings` | `/(app)/userEdit` | `/(auth)` | `/(auth)/login` | `/(auth)/register` | `/(tabs)` | `/(tabs)/` | `/(tabs)/friend` | `/(tabs)/message` | `/(tabs)/request` | `/(tabs)/settings` | `/_sitemap` | `/friend` | `/login` | `/message` | `/register` | `/request` | `/settings` | `/userEdit`;
      DynamicRoutes: `/(app)/chat/${Router.SingleRoutePart<T>}` | `/chat/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(app)/chat/[friendId]` | `/chat/[friendId]`;
    }
  }
}
