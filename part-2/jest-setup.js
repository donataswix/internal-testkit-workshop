import {NativeModules} from 'react-native';

NativeModules.SwipeActionViewManager = {SwipeTransitions: jest.fn()};
NativeModules.RNDeviceInfo = {};
NativeModules.StatusBarManager.getHeight = jest.fn();

jest.mock('wix-react-native-ui-lib', () => {
  const lib = require.requireActual('wix-react-native-ui-lib');
  return {
    ...lib,
    Text: 'Text',
    View: 'View',
  };
});
