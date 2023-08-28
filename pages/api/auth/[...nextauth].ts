import NextAuth, {NextAuthOptions} from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"
import { JWT } from "next-auth/jwt"


async function refreshAccessToken(token: JWT) {
	try {
		spotifyApi.setAccessToken(token.accessToken)
		spotifyApi.setRefreshToken(token.refreshToken)

		const { body: refreshedToken } = await spotifyApi.refreshAccessToken()
		console.log("refreshed token", refreshedToken);

		return {
			...token,
			accessToken: refreshedToken.access_token,
			accessTokenExpires: refreshedToken.expires_in * 1000 + Date.now(),
			refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
		}
	}catch (error) {
		console.log("error refreshing token")
		console.log(error)
		return {
			...token,
			error: 'RefreshAccessTokenError',
		}
	}
}

export const  authOptions: NextAuthOptions = ({
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID ?? '',
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET ?? '',
	  authorization : LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
	signIn: '/login',
  },
  callbacks: {
	async jwt({ token, account, user }) {
		

		if (account && user)
		{
			return {
				...token,
				accessToken: account.access_token,
				refreshToken: account.refresh_token,
				username: account.providersAccountId,
				// @ts-ignore
				accessTokenExpires: account.expires_at * 1000,
			}
		}

		// @ts-ignore
		if (Date.now() < token.accessTokenExpires) {
			console.log("token is valid")
			return token
		}

		// Access token has expired, try to update it
		console.log("token expired, trying to refresh")
		return await refreshAccessToken(token)
	},

	async session({ session, token }) {


		if (!session.user)	{
			return session
		}

		// @ts-ignore
		session.user.accessToken = token.accessToken;
		// @ts-ignore
		session.user.refreshToken = token.refreshToken;
		// @ts-ignore
		session.user.username = token.username;

		return session;
	},
  }
})

export default NextAuth(authOptions);