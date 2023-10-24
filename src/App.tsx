import { ThemeProvider } from "theme-ui";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import theme from "./theme";
import Home from "./routes/Home";
import Game from "./routes/Game";

import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { KeyboardProvider } from "./contexts/KeyboardContext";
import { DatabaseProvider } from "./contexts/DatabaseContext";
import { UserIdProvider } from "./contexts/UserIdContext";

import { ToastProvider } from "./components/Toast";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SettingsProvider>
        <AuthProvider>
          <KeyboardProvider>
            <ToastProvider>
              <Router>
                <Switch>
                  <Route path="/game/:id">
                    <DatabaseProvider>
                      <UserIdProvider>
                        <Game />
                      </UserIdProvider>
                    </DatabaseProvider>
                  </Route>
                  <Route path="/">
                    <Home />
                  </Route>
                </Switch>
              </Router>
            </ToastProvider>
          </KeyboardProvider>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
