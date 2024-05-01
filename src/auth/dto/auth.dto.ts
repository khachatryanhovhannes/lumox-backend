import { IsNotEmpty, IsString, Matches } from 'class-validator';

class AuthDto {
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Invalid email address',
  })
  @IsNotEmpty()
  email: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$!.%*#?&]{8,}$/,
    {
      message: 'Invalid password',
    },
  )
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;
}

class SignInDto {
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Invalid email address',
  })
  @IsNotEmpty()
  email: string;

  // @Matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$!.%*#?&]{8,}$/,
  //   {
  //     message: 'Invalid password',
  //   },
  // )
  @IsString()
  @IsNotEmpty()
  password: string;
}

export { AuthDto, SignInDto };
