import { LoginForm } from '@/components/LoginForm/LoginForm';
import { Dashboard } from '@/components/Dashboard/Dashboard';

export default function Home() {
  const auth = false;
  return (
    <>
      {auth ? <Dashboard/> : <LoginForm/>}
    </>
  )
}
