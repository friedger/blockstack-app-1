# `@blockstack/connect`

A library for building excellent user experiences with [Blockstack](https://blockstack.org/).

<!-- TOC depthFrom:2 -->

- [Demo](#demo)
- [Why?](#why)
- [Installation](#installation)
- [API](#api)
  - [AuthOptions](#authoptions)
  - [In React Apps](#in-react-apps)
  - [In ES6 (non-React) apps](#in-es6-non-react-apps)
  - [Using a hosted version of `@blockstack/connect`](#using-a-hosted-version-of-blockstackconnect)
  - [Sending users to sign in immediately](#sending-users-to-sign-in-immediately)
- [Design Guidance](#design-guidance)
  - [Delay Blockstack onboarding as long as possible](#delay-blockstack-onboarding-as-long-as-possible)
  - [Provide an easy way in for new users](#provide-an-easy-way-in-for-new-users)
  - [Provide a quick way for existing users to sign in](#provide-a-quick-way-for-existing-users-to-sign-in)
- [Local Development](#local-development)

<!-- /TOC -->

## Demo

To get a test feel for the user experience of using `connect`, you can use [Banter](https://banter.pub).

## Why?

Although [`blockstack.js`](https://github.com/blockstack/blockstack.js) exposes everything you need to handle authentication with Blockstack, there is still the hard problem of getting users used to the paradigm of authentication that is privacy-first and self-sovereign. Many apps implement their own dialogues before authentication, which explain what Blockstack is and why they use it.

`@blockstack/connect` provides developers with a plug-and-play API that is simple to use, and provides great, out-of-the-box education that end-users can understand.

## Installation

With yarn:

```bash
yarn add @blockstack/connect
```

With npm:

```bash
npm install --save @blockstack/connect
```

## API

### AuthOptions

Every major method you'll use with `connect` requires you to pass some options, like the name and icon of your app, and what to do when authentication is finished. In practice, this means you need to define these options, and pass them to the various API methods.

The exact interface you'll use [is defined as](https://github.com/blockstack/connect/blob/master/src/auth.ts#L12:L24):

```typescript
export interface AuthOptions {
  // The URL you want the user to be redirected to after authentication.
  redirectTo: string;
  manifestPath?: string;
  finished?: (payload: FinishedData) => void;
  authOrigin?: string;
  sendToSignIn?: boolean;
  userSession?: UserSession;
  appDetails: {
    name: string;
    icon: string;
  };
}
```

- `redirectTo`: The path in your app where users go after sign in.
- `appDetails`: an optional object which includes `appName: string` and `appIcon: string`. This will speed up the process of loading your app's information during onboarding.
- `manifestPath`: __(optional)__ - the path in your app where your manifest.json file can be found
- `finished`: __(optional)__ - A callback that can be invoked after authentication. This prevents having to do a whole page refresh in a new tab. One argument is passed to this callback, which is an object with `userSession` included. If included, then the `redirectTo` path is ignored, and the user will be logged in automatically.
- `authOrigin`: __(optional)__ - The URL you'd like to use for authentication. Only necessary for local development of the authenticator.
- `sendToSignIn`: __(optional)__ - defaults to `false`. Whether the user should go straight to the 'sign in' flow.
- `userSession`: __(optional)__ - pass a `UserSession` instance to use for authentication. If it's not passed, `@blockstack/connect` will create one for you.

### In React Apps

If you're using `connect` in a React app, then the best option is to include `connect`'s React infrastructure and hooks in your React app.

First, setup the `Connect` provider at the "top-level" of your app - probably next to wherever you would put a Redux provider, for example.

```javascript
import { Connect } from '@blockstack/connect';

const authOptions = {
  redirectTo: '/',
  finished: ({ userSession }) => {
    console.log(userSession.loadUserData());
  },
  appDetails: {
    name: 'My Cool App',
    icon: 'https://example.com/icon.png',
  },
};

const App = () => (
  <Connect authOptions={authOptions}>
    // the rest of your app's components
  </Connect>
)
```

Later, when you want to begin the onboarding process, use the `useConnect` hook to get `connect`'s `doOpenAuth` method.

```javascript
import { useConnect } from '@blockstack/connect';

const SignInButton = () => {
  const { doOpenAuth } = useConnect();

  return (
    <Button onClick={doOpenAuth}>
      Sign In
    </Button>
  )
}
```

### In ES6 (non-React) apps

If you aren't using React, or just want a simpler API, then you can use the `showBlockstackConnect` method.


```javascript
import { showBlockstackConnect } from '@blockstack/connect';

const authOptions = { /** See docs above for options */ };
showBlockstackConnect(authOptions);
```

**Note about dependency size:**

If you're building a non-React app, note that importing `@blockstack/connect` will add React dependencies to your JavaScript bundle. We recommend using something like [Webpack resolve aliases](https://webpack.js.org/configuration/resolve/) to replace `react` with `preact` in production, which reduces your bundle size. Check out [our own webpack.config.js file](https://github.com/blockstack/ux/blob/fix/connect-modal-accessibility/packages/connect/webpack.config.js#L87:L95) to see how we use this for production builds.

If you're using the hosted version of `@blockstack/connect` (described below), then you already have a production-optimized bundle.

### Using a hosted version of `@blockstack/connect`

If you aren't using ES6 imports, you can still use `connect`! We package the library so that it can be automatically used with [unpkg](https://unpkg.com/).

First, include the script in your HTML:

```html
<script src="https://unpkg.com/@blockstack/connect" />
```

Then, you can use API methods under the `blockstackConnect` global variable:


```javascript
const authOptions = { /** See docs above for options */ };
blockstackConnect.showBlockstackConnect(authOptions);
```

### Sending users to sign in immediately

Our design guidance, explained below, encourages your app to have a dedicated "Sign In" call-to-action. This will send them immediately to authenticate, with a screen for entering their Secret Key, if they aren't logged in to the authenticator.

To do so, use the `authenticate` method, and make sure to specify `sendToSignIn: true`.

```javascript
import { authenticate } from '@blockstack/connect';

const authOptions = {
  sendToSignIn: true,
  // your other AuthOptions
};
authenticate(authOptions)
```

Or, if you're using our React hooks, pass `true` as the first argument in `doOpenAuth`.


```javascript
const { doOpenAuth } = useConnect();

doOpenAuth(true);
```

## Design Guidance

Blockstack is valuable to users, but it can also be a barrier to those unfamiliar with Blockstack. The following guidelines serve to remedy that and help you onboard as many new users as you can. 

### Delay Blockstack onboarding as long as possible

People will often leave apps when things are asked of them before they experience the app. Give them a chance to try your app before you ask them to sign up with Blockstack. For example, a note taking app could let a new user write a couple of notes before prompting them to save their progress.

### Provide an easy way in for new users

Many new users to your app will not be familiar with Blockstack yet and will be hesitant to click a Blockstack-branded button. Provide a generic button for users that are new to your app and Blockstack. Blockstack Connect will introduce new users to Blockstack and recognize existing users.

![Design Guidance Example](./docs/call-to-action-branding.png)

### Provide a quick way for existing users to sign in

You can point users to a specific part of the Blockstack App. For instance, a “Sign in” button on your website can redirect users to the sign in flow of the Blockstack App. If you do this, make sure you also have an option that is explicitly for new users and that points to the sign up flow.

To implement this functionality, check out our section on sending users to sign in immediately.

## Local Development

There is a test app located in `/test-app`. `cd test-app && yarn && yarn start` to run a local react app with `fast-refresh`.
