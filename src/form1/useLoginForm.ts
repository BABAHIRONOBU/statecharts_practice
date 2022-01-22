import {
  useReducer,
  useEffect,
} from 'react';
import { usePrevious } from './usePrevious';
import {
  reducer, initState,
  resolveSending,
  rejectSending,
  resolveAuthing,
  rejectAuthing,
  resolveResending,
  rejectResending,
} from './reducer';
import { sendAuthNumberr, authAuthNumber } from './api';

export const useLoginForm = () => {
  const [state, dispatch] = useReducer(reducer, undefined, initState);
  const {
    status,
    phoneNumber,
    authNumber,
    phoneNumberInputError,
    authNumberInputError,
  } = state;

  const prevState = usePrevious(state);

  const isPhoneNumberStep = ['phoneNumberInvalid', 'phoneNumberValid', 'sendError', 'sending'].includes(status);
  const isSending = status === 'sending';
  const isResending = status === 'resending';
  const isAuthing = status === 'authing';
  const isCompleted = status === 'completed';

  useEffect(() => {
    if (status === 'sending') {
      sendAuthNumberr(phoneNumber)
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
    }
  }, [status, phoneNumber]);

  useEffect(() => {
    if (status === 'authNumberInvalid' && prevState?.status === 'sending') {
      console.log('start timer');
    }
  }, [status, prevState?.status]);

  useEffect(() => {
    if (status === 'authNumberInvalid' && prevState?.status === 'resending') {
      console.log('restart timer');
    }
  }, [status, prevState?.status]);

  useEffect(() => {
    if (status === 'authNumberValid' && prevState?.status === 'resending') {
      console.log('restart timer');
    }
  }, [status, prevState?.status]);

  useEffect(() => {
    if (status === 'resending') {
      sendAuthNumberr(phoneNumber)
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
    }
  }, [status, phoneNumber]);

  useEffect(() => {
    if (status === 'authing') {
      authAuthNumber(phoneNumber, authNumber)
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
    }
  }, [status, phoneNumber, authNumber]);

  useEffect(() => {
    if (status === 'completed') {
      console.log('stop timer');
      alert('서비스 홈 페이지로 라우팅!');
    }
  }, [status]);

  return {
    dispatch,
    status,
    phoneNumber,
    authNumber,
    phoneNumberInputError,
    authNumberInputError,
    isPhoneNumberStep,
    isSending,
    isResending,
    isAuthing,
    isCompleted,
  };
};
