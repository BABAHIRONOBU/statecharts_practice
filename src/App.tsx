import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Index } from './Index';
import { Form1 } from './form1/Form1';
import { Form2 } from './form2/Form2';

export const App: React.FC = () => {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Index />} />
          <Route path='form1' element={<Form1 />}></Route>
          <Route path='form2' element={<Form2 />}></Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};
