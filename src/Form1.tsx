import React, {
  useReducer,
  useEffect,
  useRef,
} from 'react';
import {
  Container, Box, Text,
  FormControl, FormLabel, Input, FormErrorMessage, Button,
} from '@chakra-ui/react';

export const Form1: React.FC = () => {
  const initialState = initState();

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    phoneNumber,
    authNumber,
    phoneNumberInputError,
    authNumberInputError,
  } = state;

  const prevState = usePrevious(state);

  const isPhoneNumberStep = ['phoneNumberInvalid', 'phoneNumberValid', 'sendError', 'sending'].includes(state.status);
  const isSending = state.status === 'sending';
  const isResending = state.status === 'resending';
  const isAuthing = state.status === 'authing';
  const isCompleted = state.status === 'completed';

  useEffect(() => {
    if (state.status === 'sending') {
      sendAuthNumber(state.phoneNumber)
        .then((res) => {
          if (res.status === 200) {
            dispatch({ type: 'RESOLVE_SENDING' });
          } else {
            dispatch({ type: 'REJECT_SENDING', error: res.msg });
          }
        })
        .catch((e) => {
          dispatch({ type: 'REJECT_SENDING', error: '인증번호 전송에 실패했습니다.' });
        });

    } else if (state.status === 'authNumberInvalid' && prevState?.status === 'sending') {
      console.log('start timer');

    } else if (state.status === 'authNumberInvalid' && prevState?.status === 'resending') {
      console.log('restart timer');

    } else if (state.status === 'authNumberValid' && prevState?.status === 'resending') {
      console.log('restart timer');

    } else if (state.status === 'resending') {
      sendAuthNumber(state.phoneNumber)
        .then((res) => {
          if (res.status === 200) {
            dispatch({ type: 'RESOLVE_RESENDING' });
          } else {
            dispatch({ type: 'REJECT_RESENDING', error: res.msg });
          }
        })
        .catch((e) => {
          dispatch({ type: 'REJECT_RESENDING', error: '인증번호 재전송에 실패했습니다.' });
        });
    } else if (state.status === 'authing') {
      authAuthNumber(state.phoneNumber, state.authNumber)
        .then((res) => {
          if (res.status === 200) {
            dispatch({ type: 'RESOLVE_AUTHING' });
          } else {
            dispatch({ type: 'REJECT_AUTHING', error: res.msg });  
          }
        })
        .catch((e) => {
          dispatch({ type: 'REJECT_AUTHING', error: '인증번호 인증에 실패했습니다.' });
        });

    } else if (state.status === 'completed') {
      console.log('stop timer');
      alert('서비스 홈 페이지로 라우팅!');

    } else {
      return;
    }
  }, [state.status, prevState?.status, state.phoneNumber, state.authNumber]);

  return (
    <Container display='flex' flexDirection='column' marginTop={16}>
      <Box>
        <FormControl isInvalid={state.status === 'sendError'}>
          <FormLabel>휴대폰번호</FormLabel>
          <Input
            value={phoneNumber}
            onClick={() => dispatch({ type: 'CLICK_PHONE_NUMBER_INPUT' })}
            onChange={(e) => dispatch({ type: 'CHANGE_PHONE_NUMBER_INPUT', phoneNumber: e.target.value })}
          />
          <FormErrorMessage>{phoneNumberInputError}</FormErrorMessage>
        </FormControl>

        {isPhoneNumberStep
          ? <Button
              marginTop={4}
              isFullWidth
              isLoading={isSending}
              loadingText='인증번호 전송 중...'
              onClick={() => dispatch({ type: 'SEND_AUTH_NUMBER' })}
            >
              인증번호 전송하기
            </Button>
          : <Box marginTop={8}>
              <FormControl isInvalid={state.status === 'authError'}>
                <FormLabel>인증번호</FormLabel>
                <Input
                  value={authNumber}
                  onChange={(e) => dispatch({ type: 'CHANGE_AUTH_NUMBER_INPUT', authNumber: e.target.value })}
                />
                <FormErrorMessage>{authNumberInputError}</FormErrorMessage>
              </FormControl>

              <Box display='flex' flexDirection='column' alignItems='center' marginTop={4}>
                <Text>인증번호를 받지 못하셨나요?</Text>
                <Button
                  variant='link'
                  isLoading={isResending}
                  loadingText='인증번호 재전송 중...'
                  onClick={() => dispatch({ type: 'RESEND_AUTH_NUMBER' })}
                >
                  인증번호 재전송하기
                </Button>
              </Box>

              <Button
                isFullWidth
                marginTop={4}
                isLoading={isAuthing}
                loadingText='인증번호 인증 중...'
                onClick={() => {
                  if (isCompleted) {
                    alert('서비스 홈 페이지로 라우팅!');
                    return;
                  }
                  dispatch({ type: 'AUTHENTICATE_AUTH_NUMBER' });
                }}
              >
                {isCompleted ? '서비스 시작하기' : '인증번호 인증하기'}
              </Button>
            </Box>
        }
      </Box>
    </Container>
  );
};

function usePrevious<T = any>(value: T) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef<T>();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

function wait(time: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

type Response = {
  msg: string,
  status: number
};

async function sendAuthNumber(phoneNumber: string): Promise<Response> {
  await wait(2000);

  let res: Response;

  const random = Math.random();

  if (phoneNumber.length !== 11) {
    res = {
      msg: '전화번호 형식이 알맞지 않습니다.',
      status: 400,
    };
  } else if (random >  0.7) {
    res = {
      msg: '인증번호 전송에 실패했습니다.',
      status: 500,
    };
  } else {
    res = {
      msg: '성공',
      status: 200,
    };
  }

  return res;
}

async function authAuthNumber(phoneNumber: string, authNumber: string): Promise<Response> {
  await wait(3000);

  let res: Response;

  const random = Math.random();

  /**
   * TODO: 전화번호로 인증번호를 보내지 않음
   */
  if (random > 0.9) {
    res = {
      msg: '인증번호가 일치하지 않습니다.',
      status: 400,
    };
  } else if (random > 0.8) {
    res = {
      msg: '인증번호 인증에 문제가 발생하였습니다. 다시 한번 시도해주세요.',
      status: 500,
    };
  } else {
    res = {
      msg: '성공',
      status: 200,
    };
  }

  return res;
}

// state
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

function initState(): State {
  return {
    status: 'phoneNumberInvalid',
    phoneNumber: '',
    authNumber: '',
    phoneNumberInputError: null,
    authNumberInputError: null,
  };
}

// action
type ChangePhoneNumberInput = {
  type: 'CHANGE_PHONE_NUMBER_INPUT',
  phoneNumber: string,
};

type SendAuthNumber = {
  type: 'SEND_AUTH_NUMBER',
};

type ResolveSending = {
  type: 'RESOLVE_SENDING',
};

type RejectSending = {
  type: 'REJECT_SENDING',
  error: string,
};

type ClickPhoneNumberInput = {
  type: 'CLICK_PHONE_NUMBER_INPUT',
};

type ChangeAuthNumberInput = {
  type: 'CHANGE_AUTH_NUMBER_INPUT',
  authNumber: string,
};

type ResendAuthNumber = {
  type: 'RESEND_AUTH_NUMBER',
};

type AuthenticateAuthNumber = {
  type: 'AUTHENTICATE_AUTH_NUMBER',
};

type ResolveAuthing = {
  type: 'RESOLVE_AUTHING',
};

type RejectAuthing = {
  type: 'REJECT_AUTHING',
  error: string,
};

type ResolveResending = {
  type: 'RESOLVE_RESENDING',
};

type RejectResending = {
  type: 'REJECT_RESENDING',
  error: string,
};

type Timeout = {
  type: 'TIMEOUT',
}

type Action = ChangePhoneNumberInput
  | SendAuthNumber 
  | ResolveSending 
  | RejectSending 
  | ClickPhoneNumberInput 
  | ChangeAuthNumberInput
  | ResendAuthNumber
  | AuthenticateAuthNumber
  | ResolveAuthing
  | RejectAuthing
  | ResolveResending
  | RejectResending
  | Timeout;

// reducer
function reducer(state: State, action: Action): State {
  switch (state.status) {
    case 'phoneNumberInvalid': return phoneNumberInvalidReducer(state, action);

    case 'phoneNumberValid': return phoneNumberValidReducer(state, action);

    case 'sendError': return sendingReducer(state, action);

    case 'sending': return sendingReducer(state, action);

    case 'authNumberInvalid': return authNumberInvalidReducer(state, action);

    case 'authNumberValid': return authNumberValidReducer(state, action);

    case 'authError': return authErrorReducer(state, action);

    case 'resending': return resendingReducer(state, action);

    case 'authing': return authingReducer(state, action);

    case 'timedOut': return timedOutReducer(state, action);

    case 'completed': return completedReducer(state, action);

    default: return state;
  }
}

function phoneNumberInvalidReducer(state: State, action: Action): State {
  if (state.status !== 'phoneNumberInvalid') {
    return state;
  }

  switch (action.type) {
    case 'CHANGE_PHONE_NUMBER_INPUT': {
      return {
        ...state,
        status: validatePhoneNumber(action.phoneNumber) ? 'phoneNumberValid' : 'phoneNumberInvalid',
        phoneNumber: action.phoneNumber,
      };
    }

    default: {
      return state;
    }
  }
}

function phoneNumberValidReducer(state: State, action: Action): State {
  if (state.status !== 'phoneNumberValid') {
    return state;
  }

  switch (action.type) {
    case 'CHANGE_PHONE_NUMBER_INPUT': {
      return {
        ...state,
        status: validatePhoneNumber(action.phoneNumber) ? 'phoneNumberValid' : 'phoneNumberInvalid',
        phoneNumber: action.phoneNumber,
      };
    }

    case 'SEND_AUTH_NUMBER': {
      return {
        ...state,
        status: 'sending',
      };
    }

    default: {
      return state;
    }
  }
}

function sendErrorReducer(state: State, action: Action): State {
  if (state.status !== 'sendError') {
    return state;
  }

  switch (action.type) {
    case 'CHANGE_PHONE_NUMBER_INPUT': {
      return {
        ...state,
        status: validatePhoneNumber(action.phoneNumber) ? 'phoneNumberValid' : 'phoneNumberInvalid',
        phoneNumber: action.phoneNumber,
      };
    }

    case 'SEND_AUTH_NUMBER': {
      return {
        ...state,
        status: 'sending',
      };
    }

    default: {
      return state;
    }
  }
}

function sendingReducer(state: State, action: Action): State {
  if (state.status !== 'sending') {
    return state;
  }

  switch (action.type) {
    case 'RESOLVE_SENDING': {
      return {
        ...state,
        status: 'authNumberInvalid',
      };
    }

    case 'REJECT_SENDING': {
      return {
        ...state,
        status: 'sendError',
        phoneNumberInputError: action.error,
      };
    }

    default: {
      return state;
    }
  }
}

function authNumberInvalidReducer(state: State, action: Action): State {
  if (state.status !== 'authNumberInvalid') {
    return state;
  }

  switch (action.type) {
    case 'CHANGE_AUTH_NUMBER_INPUT': {
      return {
        ...state,
        status: validateAuthNumber(action.authNumber) ? 'authNumberValid': 'authNumberInvalid',
        authNumber: action.authNumber,
      };
    }

    case 'RESEND_AUTH_NUMBER': {
      return {
        ...state,
        status: 'resending',
      };
    }

    case 'TIMEOUT': {
      return {
        ...state,
        status: 'timedOut',
      };
    }

    case 'CLICK_PHONE_NUMBER_INPUT': {
      return {
        ...state,
        status: 'phoneNumberInvalid',
        phoneNumber: '',
        authNumber: '',
      };
    }

    default: {
      return state;
    }
  }
}

function authNumberValidReducer(state: State, action: Action): State {
  if (state.status !== 'authNumberValid') {
    return state;
  }

  switch (action.type) {
    case 'CHANGE_AUTH_NUMBER_INPUT': {
      return {
        ...state,
        status: validateAuthNumber(action.authNumber) ? 'authNumberValid': 'authNumberInvalid',
        authNumber: action.authNumber,
      };
    }

    case 'RESEND_AUTH_NUMBER': {
      return {
        ...state,
        status: 'resending',
      };
    }

    case 'AUTHENTICATE_AUTH_NUMBER': {
      return {
        ...state,
        status: 'authing',
      };
    }

    case 'TIMEOUT': {
      return {
        ...state,
        status: 'timedOut',
      };
    }

    case 'CLICK_PHONE_NUMBER_INPUT': {
      return {
        ...state,
        status: 'phoneNumberInvalid',
        phoneNumber: '',
        authNumber: '',
      };
    }

    default: {
      return state;
    }
  }
}

function authErrorReducer(state: State, action: Action): State {
  if (state.status !== 'authError') {
    return state;
  }

  switch (action.type) {
    case 'CHANGE_AUTH_NUMBER_INPUT': {
      return {
        ...state,
        status: validateAuthNumber(action.authNumber) ? 'authNumberValid': 'authNumberInvalid',
        authNumber: action.authNumber,
      };
    }

    case 'RESEND_AUTH_NUMBER': {
      return {
        ...state,
        status: 'resending',
      };
    }

    case 'AUTHENTICATE_AUTH_NUMBER': {
      return {
        ...state,
        status: 'authing',
      };
    }

    case 'TIMEOUT': {
      return {
        ...state,
        status: 'timedOut',
      };
    }

    case 'CLICK_PHONE_NUMBER_INPUT': {
      return {
        ...state,
        status: 'phoneNumberInvalid',
        phoneNumber: '',
        authNumber: '',
      };
    }

    default: {
      return state;
    }
  }
}

function resendingReducer(state: State, action: Action): State {
  if (state.status !== 'resending') {
    return state;
  }

  switch (action.type) {
    case 'RESOLVE_RESENDING': {
      return {
        ...state,
        status: validateAuthNumber(state.phoneNumber) ? 'authNumberValid': 'authNumberInvalid',
        authNumber: '',
      };
    }

    case 'REJECT_RESENDING': {
      return {
        ...state,
        status: 'authError',
        authNumberInputError: action.error,
      };
    }

    case 'TIMEOUT': {
      return {
        ...state,
        status: 'timedOut',
      };
    }

    default: {
      return state;
    }
  }
}

function authingReducer(state: State, action: Action): State {
  if (state.status !== 'authing') {
    return state;
  }

  switch (action.type) {
    case 'RESOLVE_AUTHING': {
      return {
        ...state,
        status: 'completed',
      };
    }

    case 'REJECT_AUTHING': {
      return {
        ...state,
        status: 'authError',
        authNumberInputError: action.error,
      };
    }

    default: {
      return state;
    }
  }
}

function timedOutReducer(state: State, action: Action): State {
  if (state.status !== 'timedOut') {
    return state;
  }

  switch (action.type) {
    case 'RESEND_AUTH_NUMBER': {
      return {
        ...state,
        status: 'resending',
      };
    }

    case 'TIMEOUT': {
      return {
        ...state,
        status: 'timedOut',
      };
    }

    default: {
      return state;
    }
  }
}

function completedReducer(state: State, action: Action): State {
  return state;
}

function validatePhoneNumber(phoneNumber: string): boolean {
  return phoneNumber.length === 11;
}

function validateAuthNumber(authNumber: string): boolean {
  return authNumber.length === 6;
}
