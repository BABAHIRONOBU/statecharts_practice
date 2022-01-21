import React, {
  useReducer,
  useEffect,
  useRef,
} from 'react';
import {
  Container, Box, Text,
  FormControl, FormLabel, Input, FormErrorMessage, Button,
} from '@chakra-ui/react';
import {
  initState, reducer,
  changePhoneNumberInput,
  sendAuthNumber,
  resolveSending,
  rejectSending,
  clickPhoneNumberInput,
  changeAuthNumberInput,
  resendAuthNumber,
  authenticateAuthNumber,
  resolveAuthing,
  rejectAuthing,
  resolveResending,
  rejectResending,
  timeout,
} from './reducer';


export const Form1: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, undefined, initState);
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
      sendAuthNumberr(state.phoneNumber)
        .then((res) => {
          if (res.status === 200) {
            dispatch(resolveSending());
          } else {
            dispatch(rejectSending({ error: res.msg }));
          }
        })
        .catch((e) => {
          dispatch(rejectSending({ error: '인증번호 전송에 실패했습니다.' }));
        });

    } else if (state.status === 'authNumberInvalid' && prevState?.status === 'sending') {
      console.log('start timer');

    } else if (state.status === 'authNumberInvalid' && prevState?.status === 'resending') {
      console.log('restart timer');

    } else if (state.status === 'authNumberValid' && prevState?.status === 'resending') {
      console.log('restart timer');

    } else if (state.status === 'resending') {
      sendAuthNumberr(state.phoneNumber)
        .then((res) => {
          if (res.status === 200) {
            dispatch(resolveResending());
          } else {
            dispatch(rejectResending({ error: res.msg }));
          }
        })
        .catch((e) => {
          dispatch(rejectResending({ error: '인증번호 재전송에 실패했습니다.' }));
        });
    } else if (state.status === 'authing') {
      authAuthNumber(state.phoneNumber, state.authNumber)
        .then((res) => {
          if (res.status === 200) {
            dispatch(resolveAuthing());
          } else {
            dispatch(rejectAuthing({ error: res.msg }));  
          }
        })
        .catch((e) => {
          dispatch(rejectAuthing({ error: '인증번호 인증에 실패했습니다.' }));
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
            onClick={() => dispatch(clickPhoneNumberInput())}
            onChange={(e) => dispatch(changePhoneNumberInput({ phoneNumber: e.target.value }))}
          />
          <FormErrorMessage>{phoneNumberInputError}</FormErrorMessage>
        </FormControl>

        {isPhoneNumberStep
          ? <Button
              marginTop={4}
              isFullWidth
              isLoading={isSending}
              loadingText='인증번호 전송 중...'
              onClick={() => dispatch(sendAuthNumber())}
            >
              인증번호 전송하기
            </Button>
          : <Box marginTop={8}>
              <FormControl isInvalid={state.status === 'authError'}>
                <FormLabel>인증번호</FormLabel>
                <Input
                  value={authNumber}
                  onChange={(e) => dispatch(changeAuthNumberInput({ authNumber: e.target.value }))}
                />
                <FormErrorMessage>{authNumberInputError}</FormErrorMessage>
              </FormControl>

              <Box display='flex' flexDirection='column' alignItems='center' marginTop={4}>
                <Text>인증번호를 받지 못하셨나요?</Text>
                <Button
                  variant='link'
                  isLoading={isResending}
                  loadingText='인증번호 재전송 중...'
                  onClick={() => dispatch(resendAuthNumber())}
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
                  dispatch(authenticateAuthNumber());
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

async function sendAuthNumberr(phoneNumber: string): Promise<Response> {
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
  } else if (random > 0.7) {
    res = {
      msg: '해당 전화번호로 인증번호를 전송한 내역이 없습니다.',
      status: 404,
    };
  } else {
    res = {
      msg: '성공',
      status: 200,
    };
  }

  return res;
}
