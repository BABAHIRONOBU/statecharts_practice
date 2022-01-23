import {
  useReducer,
  useEffect,
} from 'react';
import {
  initState,
  reducer,
  changePnInput,
  changeAnInput,
  sendAuthNumber as sendAn,
  resendAuthNumber as resendAn,
  authenticateAuthNumber as authenticateAn,
  resolveSending,
  rejectSending,
  resolveResending,
  rejectResending,
  resolveAuthing,
  rejectAuthing,
} from './reducer';
import { usePrevious } from './usePrevious';
import {
  sendAuthNumberr,
  authAuthNumber,
} from './api';

export const useLoginForm = () => {
  const [state, dispatch] = useReducer(reducer, undefined, initState);
  const {
    status,
    phoneNumber,
    authNumber,
    pnInputError,
    anInputError,
  } = state;

  const prevState = usePrevious(state);

  const isPhoneNumberStep = status === 'pnInvalid'
    || status === 'pnValid'
    || status === 'sending'
    || status === 'sendError';
  
  const isSending = status === 'sending';
  const isResending = status === 'resending';
  const isAuthing = status === 'authing';
  const isCompleted = status === 'completed';

  const isPnError = status === 'sendError'
    || status === 'resendError'
    || status === 'timedOutPnInvalid'
    || status === 'timedOutPnValid';
  
  const isAnError = status === 'authError';

  const changePhoneNumber = (phoneNumber: string) => {
    dispatch(changePnInput({ phoneNumber }));
  };

  const changeAuthNumber = (authNumber: string) => {
    dispatch(changeAnInput({ authNumber }));
  };

  const sendAuthNumber = () => {
    dispatch(sendAn());
  };

  const resendAuthNumber = () => {
    dispatch(resendAn());
  };

  const authenticateAuthNumber = () => {
    dispatch(authenticateAn());
  };

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
    if (status === 'pnValidAnInvalid' && prevState?.status === 'sending') {
      console.log('start timer');
    }
  }, [status, prevState?.status]);

  useEffect(() => {
    if (
      (status === 'pnValidAnInvalid' && prevState?.status === 'resending')
      || (status === 'pnValidAnValid' && prevState?.status === 'resending')
    ) {
      console.log('restart timer');
    }
  }, [status, prevState?.status]);

  useEffect(() => {
    if (status === 'completed') {
      console.log('stop timer');
      alert('서비스 홈 페이지로 라우팅!');
    }
  }, [status]);

  return {
    phoneNumber,
    authNumber,
    pnInputError,
    anInputError,
    isPhoneNumberStep,
    isSending,
    isResending,
    isAuthing,
    isCompleted,
    isPnError,
    isAnError,
    changePhoneNumber,
    changeAuthNumber,
    sendAuthNumber,
    resendAuthNumber,
    authenticateAuthNumber,
  };
};
