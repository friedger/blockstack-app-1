import React, { useEffect } from 'react';
import { ThemeProvider } from '@stacks/ui';
import { RecoilRoot } from 'recoil';
import { theme } from '@common/theme';
import { Routes } from '@components/routes';
import { HashRouter as Router } from 'react-router-dom';
import { useMessagePong } from '@common/hooks/use-message-pong';
import { version } from '../../package.json';

import { css, Global } from '@emotion/react';
import { ColorModeProvider } from '@components/color-modes';
import { CssReset } from '@components/css-reset';
import { AccountsDrawer } from './drawer/accounts';
import { NetworksDrawer } from './drawer/networks-drawer';

const globalStyle = css`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
  @font-face {
    font-family: 'Open Sauce';
    src: url('/assets/fonts/OpenSauceOne-Medium.woff2') format('woff2');
    font-weight: 500;
    font-display: swap;
    font-style: normal;
  }

  @font-face {
    font-family: 'Open Sauce';
    src: url('/assets/fonts/OpenSauceOne-Regular.woff2') format('woff2');
    font-weight: 400;
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'Open Sauce';
    src: url('/assets/fonts/OpenSauceOne-SemiBold.woff2') format('woff2');
    font-weight: 600;
    font-weight: normal;
    font-style: normal;
  }

  #actions-root {
    display: flex;
    min-height: 100vh;
    width: 100%;
    flex-direction: column;
  }

  html,
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    -webkit-font-smoothing: antialiased;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: 'Open Sauce', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  }
`;

export const App: React.FC = () => {
  useMessagePong();
  useEffect(() => {
    (window as any).__APP_VERSION__ = version;
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <ColorModeProvider>
          <React.Fragment>
            <CssReset />
            <Global styles={globalStyle} />
            <Router>
              <AccountsDrawer />
              <NetworksDrawer />
              <Routes />
            </Router>
          </React.Fragment>
        </ColorModeProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
};

export default App;
