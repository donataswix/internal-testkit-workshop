export default class MyModule {
  init() {
  }

  methods() {
    return [];
  }

  onAppStateChanged() {
  }

  components() {
    return [
      {
        id: 'app.Main',
        generator: () => require('./src/App').default,
      },
    ];
  }

  prefix() {
    return 'app';
  }

  getTabs(appState) {
    return [
      {
        id: 'appTab',
        biLabel: 'app',
        screen: 'app.Main',
        title: 'App',
        label: 'App',
        testID: 'APP_TAB',
      }
    ];
  }
}
