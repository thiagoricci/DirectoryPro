import { AuthForm } from '@/components/AuthForm';

const Login = () => {
  return <AuthForm onSuccess={() => window.location.href = '/dashboard'} />;
};

export default Login;