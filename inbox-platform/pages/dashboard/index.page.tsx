import Head from 'next/head';

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>Inbox Assistant | AI Email Manager</title>
        <meta name="description" content="Inteligentný asistent pre efektívnu správu vašich emailov." />
      </Head>
      <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
        <h1>Inbox Assistant Dashboard</h1>
        <p>Vitajte v aplikácii!</p>
      </div>
    </>
  );
}
