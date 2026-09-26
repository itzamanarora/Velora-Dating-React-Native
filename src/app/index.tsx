import { Redirect } from 'expo-router';
import { api } from '@/api';

export default function Index() {
  const token = api.getToken();
  return <Redirect href={token ? '/welcome' : '/auth/login'} />;
}