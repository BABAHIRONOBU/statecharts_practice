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

export async function sendAuthNumberr(phoneNumber: string): Promise<Response> {
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

export async function authAuthNumber(phoneNumber: string, authNumber: string): Promise<Response> {
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