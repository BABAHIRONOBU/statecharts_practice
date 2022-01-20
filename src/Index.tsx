import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Button } from '@chakra-ui/react';

export const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Stack direction='row' spacing={4} m={16}>
      <Button onClick={() => navigate('/form1')}>form1</Button>
      <Button onClick={() => navigate('/form2')}>form2</Button>
    </Stack>
  );
};
