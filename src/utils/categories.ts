import { IOSNotificationCategory } from '@notifee/react-native';

export const categories: IOSNotificationCategory[] = [
  {
    id: 'quickActions',
    actions: [
      {
        id: 'first_action_reply',
        title: 'Open',
        input: true,
      },
      {
        id: 'second_action_nothing',
        title: 'Nothing',
      },
    ],
  },
];
