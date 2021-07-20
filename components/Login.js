import Image from 'next/image';
import { signIn } from 'next-auth/client';
import Button from '@material-tailwind/react/Button';
const Login = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <Image
        width={550}
        height={300}
        objectFit='contain'
        src='/img/google-docs.png'
        alt='Google Docs'
      />
      <Button
        className='w-44 mt-10'
        color='blue'
        buttonType='filled'
        ripple='light'
        onClick={signIn}
      >
        Login
      </Button>
    </div>
  );
};

export default Login;
