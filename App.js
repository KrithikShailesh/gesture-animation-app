import "react-native-gesture-handler";

import RootScreen from "./app/index";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView>
      <RootScreen />
    </GestureHandlerRootView>
  );
}
