/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import * as React from 'react';
import { mountWithIntl } from 'test_utils/enzyme_helpers';
import { setAppDependencies } from '../../app_dependencies';
import { coreMock } from '../../../../../../../../../src/core/public/mocks';
import { ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ConnectorAddFlyout } from './connector_add_flyout';
import { ActionsConnectorsContext } from '../../context/actions_connectors_context';
import { actionTypeRegistryMock } from '../../action_type_registry.mock';
import { ValidationResult } from '../../../types';
jest.mock('../../context/actions_connectors_context');
const actionTypeRegistry = actionTypeRegistryMock.create();

describe('connector_add_flyout', () => {
  let wrapper: ReactWrapper<any>;

  beforeEach(async () => {
    const deps = {
      core: coreMock.createStart(),
      plugins: {
        capabilities: {
          get() {
            return {
              actions: {
                delete: true,
                save: true,
                show: true,
              },
            };
          },
        },
      } as any,
      actionTypeRegistry: actionTypeRegistry as any,
      alertTypeRegistry: {} as any,
    };
    const AppDependenciesProvider = setAppDependencies(deps);

    await act(async () => {
      wrapper = mountWithIntl(
        <AppDependenciesProvider value={deps}>
          <ActionsConnectorsContext.Provider
            value={{
              addFlyoutVisible: true,
              setAddFlyoutVisibility: state => {},
              editFlyoutVisible: false,
              setEditFlyoutVisibility: state => {},
              actionTypesIndex: { 'my-action-type': { id: 'my-action-type', name: 'test' } },
              reloadConnectors: () => {
                return new Promise<void>(() => {});
              },
            }}
          >
            <ConnectorAddFlyout />
          </ActionsConnectorsContext.Provider>
        </AppDependenciesProvider>
      );
    });

    await waitForRender(wrapper);
  });

  it('renders action type menu on flyout open', () => {
    const actionType = {
      id: 'my-action-type',
      iconClass: 'test',
      selectMessage: 'test',
      validateConnector: (): ValidationResult => {
        return { errors: {} };
      },
      validateParams: (): ValidationResult => {
        const validationResult = { errors: {} };
        return validationResult;
      },
      actionConnectorFields: null,
      actionParamsFields: null,
    };
    actionTypeRegistry.get.mockReturnValueOnce(actionType);
    actionTypeRegistry.has.mockReturnValue(true);

    expect(wrapper.find('ActionTypeMenu')).toHaveLength(1);
    expect(wrapper.find('[data-test-subj="my-action-type-card"]').exists()).toBeTruthy();
  });
});

async function waitForRender(wrapper: ReactWrapper<any, any>) {
  await Promise.resolve();
  await Promise.resolve();
  wrapper.update();
}