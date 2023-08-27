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
      authorize: async (credentials: Credential) => {
        const path = `${process.env.NEXT_PUBLIC_API_PATH}/auth/login`;
        const body = {
          email: credentials.email,
          password: credentials.password,
        };

        const response = await fetch(path, {
          method: 'POST',
          headers: {
            'Content-type':'application/json'
          },
          body: JSON.stringify(body),
        });

        if (response.status === 200) {
          return await response.json();
        } else {
          throw new Error('Wrong credentials');
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