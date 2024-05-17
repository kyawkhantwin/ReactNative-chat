import Root from "./utilities/Root";
import { AppProvider } from "./utilities/useAppContext";


export default function App() {

  return (
    <AppProvider>
      <Root/>
    </AppProvider>
  );
}
