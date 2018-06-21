import React, {PureComponent} from 'react';
import {FlatList} from 'react-native';
import {Text, View} from 'wix-react-native-ui-lib';

class App extends PureComponent {
  render() {
    return (
      <View flex>
        <Text testID="app.welcome_text">Hello!</Text>
        <FlatList
          testID="app.todo"
          style={{flex: 1}}
          data={[{id: 1}, {id: 2}]}
          renderItem={({item}) => <Text testID={'app.todo.item-' + item.id}>Item</Text>}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }
}

export default App;
