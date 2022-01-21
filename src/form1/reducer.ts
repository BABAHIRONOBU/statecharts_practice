import {
  createAction,
  createReducer,
  CaseReducer,
} from '@reduxjs/toolkit';

/**
 * state
 */
type Status = 'phoneNumberInvalid'
  | 'phoneNumberValid'
  | 'sendError'
  | 'sending'
  | 'authNumberInvalid'
  | 'authNumberValid'
  | 'authError'
  | 'resending'
  | 'authing'
  | 'timedOut'
  | 'completed';

type State = {
  status: Status,
  phoneNumber: string,
  authNumber: string,
  phoneNumberInputError: string | null,
  authNumberInputError: string | null,
};

export const initState = (): State => ({
  status: 'phoneNumberInvalid',
  phoneNumber: '',
  authNumber: '',
  phoneNumberInputError: null,
  authNumberInputError: null,
});

const withPayloadType = <T>() => (t: T) => ({ payload: t });

/**
 * action creator
 * case reducer
 */
type CR<T extends (...args: any) => any> = CaseReducer<State, ReturnType<T>>;

export const changePhoneNumberInput = createAction('CHANGE_PHONE_NUMBER_INPUT', withPayloadType<{ phoneNumber: string }>());

const changePhoneNumberInputReducer: CR<typeof changePhoneNumberInput> = (state, action) => {
  state.status = validatePhoneNumber(action.payload.phoneNumber) ? 'phoneNumberValid' : 'phoneNumberInvalid';
  state.phoneNumber = action.payload.phoneNumber;
};

export const sendAuthNumber = createAction('SEND_AUTH_NUMBER');

const sendAuthNumberReducer: CR<typeof sendAuthNumber> = (state, action) => {
  state.status = 'sending';
};

export const resolveSending = createAction('RESOLVE_SENDING');

const resolveSendingReducer: CR<typeof resolveSending> = (state, action) => {
  state.status = 'authNumberInvalid';
};

export const rejectSending = createAction('REJECT_SENDING', withPayloadType<{ error: string }>());

const rejectSendingReducer: CR<typeof rejectSending> = (state, action) => {
  state.status = 'sendError';
  state.phoneNumberInputError = action.payload.error;
};

export const clickPhoneNumberInput = createAction('CLICK_PHONE_NUMBER_INPUT');

const clickPhoneNumberInputReducer: CR<typeof clickPhoneNumberInput> = (state, action) => {
  state.status = 'phoneNumberInvalid';
  state.phoneNumber = '';
  state.authNumber = '';
};

export const changeAuthNumberInput = createAction('CHANGE_AUTH_NUMBER_INPUT', withPayloadType<{ authNumber: string }>());

const changeAuthNumberInputReducer: CR<typeof changeAuthNumberInput> = (state, action) => {
  state.status = validateAuthNumber(action.payload.authNumber) ? 'authNumberValid': 'authNumberInvalid';
  state.authNumber = action.payload.authNumber;
};

export const resendAuthNumber = createAction('RESEND_AUTH_NUMBER');

const resendAuthNumberReducer: CR<typeof resendAuthNumber> = (state, action) => {
  state.status = 'resending';
};

export const authenticateAuthNumber = createAction('AUTHENTICATE_AUTH_NUMBER');

const authenticateAuthNumberReducer: CR<typeof authenticateAuthNumber> = (state, action) => {
  state.status = 'authing';
};

export const resolveAuthing = createAction('RESOLVE_AUTHING');

const resolveAuthingReducer: CR<typeof resolveAuthing> = (state, action) => {
  state.status = 'completed';
};

export const rejectAuthing = createAction('REJECT_AUTHING', withPayloadType<{ error: string }>());

const rejectAuthingReducer: CR<typeof rejectAuthing> = (state, action) => {
  state.status = 'authError';
  state.authNumberInputError = action.payload.error;
};

export const resolveResending = createAction('RESOLVE_RESENDING');

const resolveResendingReducer: CR<typeof resolveResending> = (state, action) => {
  state.status = validateAuthNumber(state.phoneNumber) ? 'authNumberValid': 'authNumberInvalid';
  state.authNumber = '';
};

export const rejectResending = createAction('REJECT_RESENDING', withPayloadType<{ error: string }>());

const rejectResendingReducer: CR<typeof rejectResending> = (state, action) => {
  state.status = 'authError';
  state.authNumberInputError = action.payload.error;
};

export const timeout = createAction('TIMEOUT');

const timeoutReducer: CR<typeof timeout> = (state, action) => {
  state.status = 'timedOut';
};

type Action = ReturnType<typeof changePhoneNumberInput>
  | ReturnType<typeof changePhoneNumberInput>
  | ReturnType<typeof sendAuthNumber>
  | ReturnType<typeof resolveSending>
  | ReturnType<typeof rejectSending>
  | ReturnType<typeof clickPhoneNumberInput>
  | ReturnType<typeof changeAuthNumberInput>
  | ReturnType<typeof resendAuthNumber>
  | ReturnType<typeof authenticateAuthNumber>
  | ReturnType<typeof resolveAuthing>
  | ReturnType<typeof rejectAuthing>
  | ReturnType<typeof resolveResending>
  | ReturnType<typeof rejectResending>
  | ReturnType<typeof timeout>

/**
 * reducer
 */
const phoneNumberInvalidReducer = createReducer(initState, (builder) => {
  builder
    .addCase(changePhoneNumberInput, changePhoneNumberInputReducer);
});

const phoneNumberValidReducer = createReducer(initState, (builder) => {
  builder
    .addCase(changePhoneNumberInput, changePhoneNumberInputReducer)
    .addCase(sendAuthNumber, sendAuthNumberReducer);
}); 

const sendErrorReducer = createReducer(initState, (builder) => {
  builder
    .addCase(changePhoneNumberInput, changePhoneNumberInputReducer)
    .addCase(sendAuthNumber, sendAuthNumberReducer);
});

const sendingReducer = createReducer(initState, (builder) => {
  builder
    .addCase(resolveSending, resolveSendingReducer)
    .addCase(rejectSending, rejectSendingReducer);
});

const authNumberInvalidReducer = createReducer(initState, (builder) => {
  builder
    .addCase(changeAuthNumberInput, changeAuthNumberInputReducer)
    .addCase(resendAuthNumber, resendAuthNumberReducer)
    .addCase(timeout, timeoutReducer)
    .addCase(clickPhoneNumberInput, clickPhoneNumberInputReducer);
});

const authNumberValidReducer = createReducer(initState, (builder) => {
  builder
    .addCase(changeAuthNumberInput, changeAuthNumberInputReducer)
    .addCase(resendAuthNumber, resendAuthNumberReducer)
    .addCase(authenticateAuthNumber, authenticateAuthNumberReducer)
    .addCase(timeout, timeoutReducer)
    .addCase(clickPhoneNumberInput, clickPhoneNumberInputReducer);
});

const authErrorReducer = createReducer(initState, (builder) => {
  builder
    .addCase(changeAuthNumberInput, changeAuthNumberInputReducer)
    .addCase(resendAuthNumber, resendAuthNumberReducer)
    .addCase(authenticateAuthNumber, authenticateAuthNumberReducer)
    .addCase(timeout, timeoutReducer)
    .addCase(clickPhoneNumberInput, clickPhoneNumberInputReducer);
});

const resendingReducer = createReducer(initState, (builder) => {
  builder
    .addCase(resolveResending, resolveResendingReducer)
    .addCase(rejectResending, rejectResendingReducer)
    .addCase(timeout, timeoutReducer);
});

const authingReducer = createReducer(initState, (builder) => {
  builder
    .addCase(resolveAuthing, resolveAuthingReducer)
    .addCase(rejectAuthing, rejectAuthingReducer);
});

const timedOutReducer = createReducer(initState, (builder) => {
  builder
    .addCase(resendAuthNumber, resendAuthNumberReducer)
    .addCase(timeout, timeoutReducer);
});

export const reducer = (state: State, action: Action): State => {
  switch (state.status) {
    case 'phoneNumberInvalid': return phoneNumberInvalidReducer(state, action);

    case 'phoneNumberValid': return phoneNumberValidReducer(state, action);

    case 'sendError': return sendErrorReducer(state, action);

    case 'sending': return sendingReducer(state, action);

    case 'authNumberInvalid': return authNumberInvalidReducer(state, action);

    case 'authNumberValid': return authNumberValidReducer(state, action);

    case 'authError': return authErrorReducer(state, action);

    case 'resending': return resendingReducer(state, action);

    case 'authing': return authingReducer(state, action);

    case 'timedOut': return timedOutReducer(state, action);

    default: return state;
  }
};

function validatePhoneNumber(phoneNumber: string): boolean {
  return phoneNumber.length === 11;
}

function validateAuthNumber(authNumber: string): boolean {
  return authNumber.length === 6;
}
