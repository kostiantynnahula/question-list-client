import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      authorize: async (credentials: any) => {
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
  callbacks: {
    jwt: async (props) => {
      const { token, user } = props;

      if (user) {

        const { id, username, accessToken } = user;
        const result = { ...token, id: Number(id), username, accessToken };
        return result;
      }

      return token;
    },
    session: async ({session, token}) => {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.accessToken = token.accessToken;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    error: '/'
  }
};

const handler = NextAuth(authOptions);

export {
  handler as GET,
  handler as POST,
}