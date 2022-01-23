import React from 'react';
import {
  Container, Box,
  FormControl, FormLabel, Input, FormErrorMessage, Button,
} from '@chakra-ui/react';
import { useLoginForm } from './useLoginForm';

export const Form2: React.FC = () => {
  const {
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
    changeAuthNumber,
    changePhoneNumber,
    sendAuthNumber,
    resendAuthNumber,
    authenticateAuthNumber,
  } = useLoginForm();

  return (
    <Container marginTop={16}>
      <Box>
        <FormControl isInvalid={isPnError}>
          <FormLabel>전화번호</FormLabel>
          <Input
            value={phoneNumber}
            onChange={(e) => changePhoneNumber(e.target.value)}
          />
          <FormErrorMessage>{pnInputError}</FormErrorMessage>
        </FormControl>

        <Button
          marginTop={4}
          isFullWidth
          isLoading={isSending || isResending}
          loadingText={isSending ? '인증번호 전송 중...' : '인증번호 재전송 중...'}
          onClick={() => {
            if (isPhoneNumberStep) {
              sendAuthNumber();
            } else {
              resendAuthNumber();
            }
          }}
        >
          { isPhoneNumberStep ? '인증번호 전송하기' : '인증번호 재전송하기' }
        </Button>
      </Box>

      {!isPhoneNumberStep && 
        <Box marginTop={8}>
          <FormControl isInvalid={isAnError}>
            <FormLabel>인증번호</FormLabel>
            <Input
              value={authNumber}
              onChange={(e) => changeAuthNumber(e.target.value)}
            />
            <FormErrorMessage>{anInputError}</FormErrorMessage>
          </FormControl>

          <Button
            marginTop={4}
            isFullWidth
            isLoading={isAuthing}
            loadingText='인증번호 인증 중...'
            onClick={() => {
              if (isCompleted) {
                alert('서비스 홈 페이지로 라우팅!');
                return;
              }
              authenticateAuthNumber();
            }}
          >
            {isCompleted ? '서비스 시작하기' : '인증번호 인증하기'}
          </Button>
        </Box>
      }
    </Container>
  );
};
