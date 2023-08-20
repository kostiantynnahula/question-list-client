import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

type Credential = {
  email: string;
  password: string;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      authorize: async (credentials: any) => {
        return {
          id: '1',
          username: 'kostia Nahula',
          email: 'kostyannagula@gmail.com'
        }
      },
      credentials: {
        email: {
          label: 'Email',
          type: 'text'
        },
        password: {
          label: 'Password',
          type: 'text'
        }
      },
    })
  ],
  pages: {
    error: '/'
  }
});

export {
  handler as GET,
  handler as POST,
}