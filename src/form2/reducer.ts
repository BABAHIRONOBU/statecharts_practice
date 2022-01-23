import {
  createAction,
  createReducer,
  CaseReducer,
} from '@reduxjs/toolkit';

// state
type Status = 
  | 'pnInvalid'
  | 'pnValid'
  | 'sending'
  | 'sendError'
  | 'pnInvalidAnInvalid'
  | 'pnInvalidAnValid'
  | 'pnValidAnInvalid'
  | 'pnValidAnValid'
  | 'resending'
  | 'resendError'
  | 'authing'
  | 'authError'
  | 'timedOutPnInvalid'
  | 'timedOutPnValid'
  | 'completed'

type State = {
  status: Status,
  phoneNumber: string,
  authNumber: string,
  pnInputError: string,
  anInputError: string,
};

export const initState = (): State => ({
  status: 'pnInvalid',
  phoneNumber: '',
  authNumber: '',
  pnInputError: '',
  anInputError: '',
});

// action creator
const payload = <T>() => (payload: T) => ({ payload });

export const changePnInput = createAction('CHANGE_PN_INPUT', payload<{ phoneNumber: string }>());

export const sendAuthNumber = createAction('SEND_AN');

export const resolveSending = createAction('RESOLVE_SENDING');

export const rejectSending = createAction('REJECT_SENDING', payload<{ error: string }>());

export const changeAnInput = createAction('CHANGE_AN_INPUT', payload<{ authNumber: string }>());

export const resendAuthNumber = createAction('RESEND_AN');

export const resolveResending = createAction('RESOLVE_RESENDING');

export const rejectResending = createAction('REJECT_RESENDING', payload<{ error: string }>());

export const authenticateAuthNumber = createAction('AUTHENTICATE_AN');

export const resolveAuthing = createAction('RESOLVE_AUTHING');

export const rejectAuthing = createAction('REJECT_AUTHING', payload<{ error: string }>());

export const timeout = createAction('TIMEOUT');

type Action = 
  | ReturnType<typeof changePnInput>
  | ReturnType<typeof sendAuthNumber>
  | ReturnType<typeof resolveSending>
  | ReturnType<typeof rejectSending>
  | ReturnType<typeof changeAnInput>
  | ReturnType<typeof resendAuthNumber>
  | ReturnType<typeof resolveResending>
  | ReturnType<typeof rejectResending>
  | ReturnType<typeof authenticateAuthNumber>
  | ReturnType<typeof resolveAuthing>
  | ReturnType<typeof rejectAuthing>
  | ReturnType<typeof timeout>

// case reducer
type CR<T extends (...args: any) => any> = CaseReducer<State, ReturnType<T>>;

const changePnInputReducer: CR<typeof changePnInput> = (state, action) => {
  if (state.status === 'pnInvalid' || state.status === 'pnValid' || state.status === 'sendError') {
    state.status = validatePhoneNumber(action.payload.phoneNumber) ? 'pnValid' : 'pnInvalid';
    state.phoneNumber = action.payload.phoneNumber;

  } else if (state.status === 'pnInvalidAnValid' || state.status === 'pnValidAnValid') {
    state.status = validatePhoneNumber(action.payload.phoneNumber) ? 'pnValidAnValid' : 'pnInvalidAnValid';
    state.phoneNumber = action.payload.phoneNumber;

  } else if (state.status === 'pnInvalidAnInvalid' || state.status === 'pnValidAnInvalid') {
    state.status = validatePhoneNumber(action.payload.phoneNumber) ? 'pnValidAnInvalid' : 'pnInvalidAnInvalid';
    state.phoneNumber = action.payload.phoneNumber;

  } else if (state.status === 'resendError') {
    const isPnValid = validatePhoneNumber(action.payload.phoneNumber);
    const isAnValid = validateAuthNumber(state.authNumber);

    state.status = isPnValid
      ? isAnValid
        ? 'pnValidAnValid'
        : 'pnValidAnInvalid'
      : isAnValid
        ? 'pnInvalidAnValid'
        : 'pnInvalidAnInvalid';

    state.phoneNumber = action.payload.phoneNumber;        

  } else if (state.status === 'timedOutPnInvalid' || state.status === 'timedOutPnValid') {
    state.status = validatePhoneNumber(action.payload.phoneNumber) ? 'timedOutPnValid' : 'timedOutPnInvalid';
    state.phoneNumber = action.payload.phoneNumber;

  } else {
    return state;
  }
};

const sendAuthNumberReducer: CR<typeof sendAuthNumber> = (state, action) => {
  state.status = 'sending';
};

const resolveSendingReducer: CR<typeof resolveSending> = (state, action) => {
  state.status = 'pnValidAnInvalid';
};

const rejectSendingReducer: CR<typeof rejectSending> = (state, action) => {
  state.status = 'sendError';
  state.pnInputError = action.payload.error;
};

const changeAnInputReducer: CR<typeof changeAnInput> = (state, action) => {
  const isPnValid = validatePhoneNumber(state.phoneNumber);
  const isAnValid = validateAuthNumber(action.payload.authNumber);

  if (isPnValid) {
    state.status = isAnValid ? 'pnValidAnValid' : 'pnValidAnInvalid';

  } else {
    state.status = isAnValid ? 'pnInvalidAnValid' : 'pnInvalidAnInvalid';
  }

  state.authNumber = action.payload.authNumber;
};

const resendAuthNumberReducer: CR<typeof resendAuthNumber> = (state, action) => {
  state.status = 'resending';
};

const resolveResendingReducer: CR<typeof resolveResending> = (state, action) => {
  const isPnValid = validatePhoneNumber(state.phoneNumber);
  const isAnValid = validateAuthNumber(state.authNumber);

  if (isPnValid) {
    state.status = isAnValid ? 'pnValidAnValid' : 'pnValidAnInvalid';

  } else {
    state.status = isAnValid ? 'pnInvalidAnValid' : 'pnInvalidAnInvalid';
  }
};

const rejectResendingReducer: CR<typeof rejectResending> = (state, action) => {
  state.status = 'resendError';
  state.pnInputError = action.payload.error;
};

const authenticateAuthNumberReducer: CR<typeof authenticateAuthNumber> = (state, action) => {
  state.status = 'authing';
};

const resolveAuthingReducer: CR<typeof resolveAuthing> = (state, action) => {
  state.status = 'completed';
};

const rejectAuthingReducer: CR<typeof rejectAuthing> = (state, action) => {
  state.status = 'authError';
  state.anInputError = action.payload.error;
};

const timeoutReducer: CR<typeof timeout> = (state, action) => {
  state.status = validatePhoneNumber(state.phoneNumber) ? 'timedOutPnValid' : 'timedOutPnInvalid';
};

// state reducer
const pnInvalidReducer = createReducer(initState, (builder) => {
  builder
    .addCase(changePnInput, changePnInputReducer);
});

const pnValidReducer = createReducer(initState, (builder) => {
  builder
    .addCase(changePnInput, changePnInputReducer)
    .addCase(sendAuthNumber, sendAuthNumberReducer);
});

const sendingReducer = createReducer(initState, (builder) => {
  builder
    .addCase(resolveSending, resolveSendingReducer)
    .addCase(rejectSending, rejectSendingReducer);
});

const sendErrorReducer = createReducer(initState, (builder) => {
  builder
    .addCase(changePnInput, changePnInputReducer)
    .addCase(sendAuthNumber, sendAuthNumberReducer);
});

const pnInvalidAnInvalidReducer = createReducer(initState, (builder) => {
  builder
    .addCase(changePnInput, changePnInputReducer)
    .addCase(changeAnInput, changeAnInputReducer)
    .addCase(timeout, timeoutReducer);
});

const pnInvalidAnValidReducer = createReducer(initState, (builder) => {
  builder
    .addCase(changePnInput, changePnInputReducer)
    .addCase(changeAnInput, changeAnInputReducer)
    .addCase(authenticateAuthNumber, authenticateAuthNumberReducer)
    .addCase(timeout, timeoutReducer);
});

const pnValidAnInvalidReducer = createReducer(initState, (builder) => {
  builder
    .addCase(changePnInput, changePnInputReducer)
    .addCase(changeAnInput, changeAnInputReducer)
    .addCase(resendAuthNumber, resendAuthNumberReducer)
    .addCase(timeout, timeoutReducer);
});

const pnValidAnValidReducer = createReducer(initState, (builder) => {
  builder
    .addCase(changePnInput, changePnInputReducer)
    .addCase(changeAnInput, changeAnInputReducer)
    .addCase(resendAuthNumber, resendAuthNumberReducer)
    .addCase(authenticateAuthNumber, authenticateAuthNumberReducer)
    .addCase(timeout, timeoutReducer);
});

const resendingReducer = createReducer(initState, (builder) => {
  builder
    .addCase(resolveResending, resolveResendingReducer)
    .addCase(rejectResending, rejectResendingReducer)
    .addCase(timeout, timeoutReducer);
});

const resendErrorReducer = createReducer(initState, (builder) => {
  builder
    .addCase(resendAuthNumber, resendAuthNumberReducer)
    .addCase(changePnInput, changePnInputReducer)
    .addCase(timeout, timeoutReducer)
    .addCase(authenticateAuthNumber, authenticateAuthNumberReducer); // 이거 여기에 넣는거 맞나?
});

const authingReducer = createReducer(initState, (builder) => {
  builder
    .addCase(resolveAuthing, resolveAuthingReducer)
    .addCase(rejectAuthing, rejectAuthingReducer)
    .addCase(timeout, timeoutReducer);
});

const authErrorReducer = createReducer(initState, (builder) => {
  builder
    .addCase(authenticateAuthNumber, authenticateAuthNumberReducer)
    .addCase(changeAnInput, changeAnInputReducer)
    .addCase(timeout, timeoutReducer)
    .addCase(resendAuthNumber, resendAuthNumberReducer); // 이거 여기에 넣는거 맞나?
});

const timedOutPnInvalidReducer = createReducer(initState, (builder) => {
  builder
    .addCase(changePnInput, changePnInputReducer);
});

const timedOutPnValidReducer = createReducer(initState, (builder) => {
  builder
    .addCase(changePnInput, changePnInputReducer)
    .addCase(resendAuthNumber, resendAuthNumberReducer);
});

// reducer
export const reducer = (state: State, action: Action): State => {
  switch (state.status) {
    case 'pnInvalid': return pnInvalidReducer(state, action);

    case 'pnValid': return pnValidReducer(state, action);

    case 'sending': return sendingReducer(state, action);

    case 'sendError': return sendErrorReducer(state, action);

    case 'pnInvalidAnInvalid': return pnInvalidAnInvalidReducer(state, action);

    case 'pnInvalidAnValid': return pnInvalidAnValidReducer(state, action);

    case 'pnValidAnInvalid': return pnValidAnInvalidReducer(state, action);

    case 'pnValidAnValid': return pnValidAnValidReducer(state, action);

    case 'resending': return resendingReducer(state, action);

    case 'resendError': return resendErrorReducer(state, action);

    case 'authing': return authingReducer(state, action);

    case 'authError': return authErrorReducer(state, action);

    case 'timedOutPnInvalid': return timedOutPnInvalidReducer(state, action);

    case 'timedOutPnValid': return timedOutPnValidReducer(state, action);

    default: return state;
  }
};

function validatePhoneNumber(phoneNumber: string): boolean {
  return phoneNumber.length === 11;
}

function validateAuthNumber(authNumber: string): boolean {
  return authNumber.length === 6;
}
