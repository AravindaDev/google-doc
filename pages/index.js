import firebase from 'firebase';
import Head from 'next/head';
import GDockHeader from '../components/GDockHeader';
import Button from '@material-tailwind/react/Button';
import Icon from '@material-tailwind/react/Icon';
import Image from 'next/image';
import { getSession, useSession } from 'next-auth/client';
import Login from '../components/Login';
import Modal from '@material-tailwind/react/Modal';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import { useState } from 'react';
import { db } from '../firebase';
import { useCollectionOnce } from 'react-firebase-hooks/firestore';
import DocumentRow from '../components/DocumentRow';

export default function Home() {
  const [session] = useSession();
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState('');
  const [snapshot] = useCollectionOnce(
    db
      .collection('userDocs')
      .doc(session.user.email)
      .collection('docs')
      .orderBy('timestamp', 'desc')
  );
  // console.log(snapshot?.docs);
  const createDoccument = () => {
    if (!input) return;

    const res = db
      .collection('userDocs')
      .doc(session.user.email)
      .collection('docs')
      .add({
        fileName: input,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    // console.log(res);
    setInput('');
    setShowModal(false);
  };

  if (!session) return <Login />;

  const modal = (
    <Modal size='sm' active={showModal} toggler={() => setShowModal(false)}>
      <ModalBody>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='outline-none w-full'
          placeholder='Enter name of document...'
          onKeyDown={(e) => e.key === 'Enter' && createDoccument()}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color='blue'
          buttonType='link'
          onClick={(e) => setShowModal(false)}
          ripple='dark'
        >
          Cancel
        </Button>
        <Button color='blue' onClick={createDoccument} ripple='light'>
          Create
        </Button>
      </ModalFooter>
    </Modal>
  );

  return (
    <div>
      <Head>
        <title>Google Doc</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <GDockHeader />
      {modal}
      <section className='bg-[#F8F9FA] px-10'>
        <div className='max-w-3xl mx-auto'>
          <div className='flex items-center justify-between py-6'>
            <h2 className='text-gray-700 text-lg'>Start a new document</h2>
            <Button
              color='gray'
              buttonType='outline'
              iconOnly={true}
              ripple='dark'
              className='border-0'
            >
              <Icon name='more_vert' size='3xl' />
            </Button>
          </div>
          <div>
            <div
              className='relative h-52 w-40 border-2 cursor-pointer hover:border-blue-700'
              onClick={(e) => setShowModal(true)}
            >
              <Image src='/img/docs-blank-googlecolors.png' layout='fill' />
            </div>
            <p className='ml-2 mt-2 font-semibold text-sm text-gray-700'>
              Blank
            </p>
          </div>
        </div>
      </section>
      <section className='bg-white px-10 md:px-0'>
        <div className='max-w-3xl mx-auto py-8 text-sm text-gray-700'>
          <div className='flex items-center justify-between pb-5'>
            <h2 className='font-medium flex-grow'>My Documents</h2>
            <p className='mr-12'>Date Created</p>
            <Icon name='folder' size='3xl' color='gray' />
          </div>

          {snapshot?.docs.map((doc) => (
            <DocumentRow
              key={doc.id}
              id={doc.id}
              fileName={doc.data().fileName}
              date={doc.data().timestamp}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  // Call to DB/API/Server
  const session = await getSession(ctx);
  return {
    props: {
      session,
    },
  };
};
