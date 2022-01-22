import React from 'react';
import {
  Container, Box, Text,
  FormControl, FormLabel, Input, FormErrorMessage, Button,
} from '@chakra-ui/react';
import { useLoginForm } from './useLoginForm';
import {
  changePhoneNumberInput,
  sendAuthNumber,
  clickPhoneNumberInput,
  changeAuthNumberInput,
  resendAuthNumber,
  authenticateAuthNumber,
} from './reducer';

export const Form1: React.FC = () => {
  const {
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
  } = useLoginForm();

  return (
    <Container display='flex' flexDirection='column' marginTop={16}>
      <Box>
        <FormControl isInvalid={status === 'sendError'}>
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
              <FormControl isInvalid={status === 'authError'}>
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
