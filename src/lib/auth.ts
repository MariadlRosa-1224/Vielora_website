import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db(process.env.MONGODB_DB_NAME!);

export const auth = betterAuth({
  database: mongodbAdapter(db, {}),

    user: {
        additionalFields: {
            sub: {
                type: "string",
                required: true,
            },
            username: {
                type: "string",
                required: true,
            },
        },
    },


  socialProviders: {
    cognito: {
      clientId: process.env.COGNITO_CLIENT_ID as string, 
      clientSecret: process.env.COGNITO_CLIENT_SECRET as string, 
      domain: process.env.COGNITO_DOMAIN as string, // e.g. "your-app.auth.us-east-1.amazoncognito.com"
      region: process.env.COGNITO_REGION as string, // e.g. "us-east-1"
      userPoolId: process.env.COGNITO_USERPOOL_ID as string, 
      scopes: ["openid", "profile", "email", "aws.cognito.signin.user.admin"],
      getUserInfo: async (token) => {
        const userInfoResponse = await fetch(`https://${process.env.COGNITO_DOMAIN}/oauth2/userInfo`, 
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        });
        if (!userInfoResponse.ok) {
          throw new Error("Failed to fetch user info from Cognito");
        }

        const userInfo = await userInfoResponse.json();

        return {
         user: {
          id: userInfo.sub,
          sub: userInfo.sub,
          username: userInfo.username || userInfo.email,
          email: userInfo.email,
          picture: userInfo.picture,
          emailVerified: userInfo.email_verified === "true" || false,
        },
        data: userInfo,
      };
    },
  },
},
});