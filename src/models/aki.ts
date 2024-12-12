import { getAddress, getEvmAddress, getSignMessage, switchEvmNeowork } from '@/services/okx/index'

export default {
  namespace: 'aki',
  state: {},
  reducers: {
    setState(state, { payload }) {
      state[payload.key] = payload.data;
      return state;
    },
  },
  effects: {
    * getWallet(action, { call, put }) {
      const result = yield call(getAddress);
      if (result.address) {
        yield put({
          type: 'setState', payload: {
            key: 'address',
            data: result.address
          }
        });
      } else {
        yield put({ type: 'setState', payload: { key: 'address', data: null } });
      }
    },
    * getEvmWallet(action, { call, put }) {
      const result = yield call(getEvmAddress);
      if (result.address) {
        yield put({
          type: 'setState', payload: {
            key: 'evmAddress',
            data: result.address
          }
        });
      } else {
        yield put({ type: 'setState', payload: { key: 'address', data: null } });
      }
    },
    * switchEvmNeowork(action, { call, put }) {
      const result = yield call(switchEvmNeowork);
      if (result) {
        yield put({ type: 'setState', payload: { key: 'switchChainStatus', data: true } });
      } else {
        yield put({ type: 'setState', payload: { key: 'switchChainStatus', data: false } });
      }
    },
    * getSignMessage(action, { call, put }) {
      const result = yield call(getSignMessage);
      if (result) {
        yield put({ type: 'setState', payload: { key: 'loginStatus', data: true } });
        localStorage.setItem('isLoginStatus', 'true');
      } else {
        yield put({ type: 'setState', payload: { key: 'loginStatus', data: false } });
        localStorage.setItem('isLoginStatus', 'false');
      }
    },
    * clearSignMessage(action, { put }) {
      yield put({ type: 'setState', payload: { key: 'loginStatus', data: false } });
      localStorage.setItem('isLoginStatus', 'false');
    },
    * changeLoginStatus(action, { put }) {
      const status = action.payload.loginStatus
      yield put({ type: 'setState', payload: { key: 'loginStatus', data: status } });
    },
  }
}
