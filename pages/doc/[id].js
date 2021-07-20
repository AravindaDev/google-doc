import Head from 'next/head';
import GDockHeader from '../../components/GDockHeader';
import Button from '@material-tailwind/react/Button';
import Icon from '@material-tailwind/react/Icon';
import { db } from '../../firebase';
import Router, { useRouter } from 'next/router';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import { getSession, signOut, useSession } from 'next-auth/client';
import Login from '../../components/Login';
import RichTextEditor from '../../components/RichTextEditor';

const Document = () => {
  const [session] = useSession();
  const router = useRouter();

  const { id } = router.query;
  if (!session) return <Login />;
  const [snapshot, loadingSnapshot] = useDocumentOnce(
    db.collection('userDocs').doc(session.user.email).collection('docs').doc(id)
  );

  if (!snapshot && !snapshot?.data()?.fileName) {
    // router.push('/');
  }

  return (
    <div>
      <Head>
        <title>Google Doc</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {/* <GDockHeader /> */}
      <header className='flex justify-between items-center p-3 pb-1'>
        <span onClick={() => router.push('/')} className='cursor-pointer'>
          <Icon name='description' size='3xl' color='blue' />
        </span>
        <div className='flex-grow px-2'>
          <h2>{snapshot?.data()?.fileName}</h2>
          <div className='flex items-center text-sm space-x-1 -ml-1 h-8 text-gray-600'>
            <p className='option'>File</p>
            <p className='option'>Edit</p>
            <p className='option'>View</p>
            <p className='option'>Insert</p>
            <p className='option'>Format</p>
            <p className='option'>Tools</p>
          </div>
        </div>
        <Button
          color='lightBlue'
          size='regular'
          buttonType='filled'
          rounded={false}
          block={false}
          iconOnly={false}
          ripple='light'
          className='hidden md:inline-flex h-10'
        >
          <Icon name='people' size='md' /> Share
        </Button>
        <img
          src={session.user.image}
          alt=''
          className='rounded-full cursor-pointer h-10 w-10 ml-2'
        />
      </header>
      <RichTextEditor />
    </div>
  );
};

export default Document;

export const getServerSideProps = async (ctx) => {
  // Call to DB/API/Server
  const session = await getSession(ctx);

  return {
    props: {
      session,
    },
  };
};
