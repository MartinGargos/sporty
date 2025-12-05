export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    EventDetail: { eventId: string };
    CreateEvent: undefined;
    EditEvent: { eventId: string };
    MyEvents: undefined;
    Profile: undefined;
    EditProfile: undefined;
    Chat: { eventId: string };
  };