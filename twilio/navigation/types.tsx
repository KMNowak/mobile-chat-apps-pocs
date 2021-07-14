/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  WelcomeScreen: undefined;
  ChatListScreen: undefined;
  CreateChatScreen: undefined;
  MessagesScreen: {
    channelId: string;
  };
  NotFoundScreen: undefined;
};
