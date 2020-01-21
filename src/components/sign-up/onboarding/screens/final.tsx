import React from 'react';
import { AppIcon } from '../../app-icon';

import { useSelector } from 'react-redux';
import { IAppState } from '../../../../store';
import { selectAppName } from '../../../../store/onboarding/selectors';
import { Wallet } from '@blockstack/keychain';
import { ScreenContent } from '../../screen/screen-content';
import { ScreenActions } from '../../screen/screen-actions';
import { ScreenBody } from '../../screen/screen-body';

interface FinalProps {
  next: (wallet: Wallet) => void;
  back: () => void;
}

export const Final: React.FC<FinalProps> = props => {
  const appName = useSelector((state: IAppState) => selectAppName(state));
  return (
    <>
      <ScreenBody textAlign="center">
        <AppIcon />
        <ScreenContent
          title={`You’re all set! ${appName} has been connected to your Data Vault`}
          body={[`Everything you do in ${appName} will be private, secure, and only accessible with your Secret Key.`]}
        />
        <ScreenActions
          action={{
            label: 'Done',
            testAttr: 'button-connect-flow-finished',
            onClick: props.next,
          }}
        />
      </ScreenBody>
    </>
  );
};