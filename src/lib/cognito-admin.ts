// src/lib/cognito-admin.ts

import "server-only";

import {
  AdminAddUserToGroupCommand,
  AdminListGroupsForUserCommand,
  AdminRemoveUserFromGroupCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
  type GroupType,
  type UserType,
} from "@aws-sdk/client-cognito-identity-provider";
import { normalizeRole, type AppRole } from "@/lib/permissions";

const AWS_REGION = process.env.AWS_REGION ?? "us-east-2";
const COGNITO_USERPOOL_ID = process.env.COGNITO_USERPOOL_ID;

if (!COGNITO_USERPOOL_ID) {
  throw new Error("COGNITO_USER_POOL_ID is missing.");
}

const cognito = new CognitoIdentityProviderClient({
  region: AWS_REGION,
});

const roleGroups = ["admin", "moderator", "user"] as const;

export type CognitoManagedUser = {
  id: string;
  userId: string;
  username: string;
  email: string;
  name: string;
  role: AppRole;
  groups: string[];
  enabled: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

function getUserAttribute(user: UserType, attributeName: string) {
  return (
    user.Attributes?.find((attribute) => attribute.Name === attributeName)
      ?.Value ?? ""
  );
}

function getSafeName({
  name,
  email,
  username,
}: {
  name?: string;
  email?: string;
  username: string;
}) {
  const cleanName = name?.trim();

  if (cleanName) return cleanName;

  const cleanEmail = email?.trim();

  if (cleanEmail) return cleanEmail.split("@")[0] || cleanEmail;

  return username;
}

function getRoleFromGroups(groups: string[]): AppRole {
  if (groups.includes("admin")) return "admin";
  if (groups.includes("moderator")) return "moderator";
  return "user";
}

async function listGroupsForUsername(username: string) {
  const result = await cognito.send(
    new AdminListGroupsForUserCommand({
      UserPoolId: COGNITO_USERPOOL_ID,
      Username: username,
    }),
  );

  return (result.Groups ?? [])
    .map((group: GroupType) => group.GroupName)
    .filter((groupName): groupName is string => Boolean(groupName));
}

async function addUserToGroup(username: string, groupName: AppRole) {
  await cognito.send(
    new AdminAddUserToGroupCommand({
      UserPoolId: COGNITO_USERPOOL_ID,
      Username: username,
      GroupName: groupName,
    }),
  );
}

async function removeUserFromGroup(username: string, groupName: AppRole) {
  await cognito.send(
    new AdminRemoveUserFromGroupCommand({
      UserPoolId: COGNITO_USERPOOL_ID,
      Username: username,
      GroupName: groupName,
    }),
  );
}

function toManagedUser(user: UserType, groups: string[]): CognitoManagedUser {
  const username = user.Username ?? "";
  const email = getUserAttribute(user, "email");
  const name = getSafeName({
    name: getUserAttribute(user, "name"),
    email,
    username,
  });

  return {
    id: username,
    userId: username,
    username,
    email,
    name,
    role: getRoleFromGroups(groups),
    groups,
    enabled: user.Enabled ?? false,
    status: user.UserStatus,
    createdAt: user.UserCreateDate?.toISOString(),
    updatedAt: user.UserLastModifiedDate?.toISOString(),
  };
}

function escapeCognitoFilterValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export async function findCognitoUserByEmail(email: string) {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) return null;

  const result = await cognito.send(
    new ListUsersCommand({
      UserPoolId: COGNITO_USERPOOL_ID,
      Filter: `email = "${escapeCognitoFilterValue(cleanEmail)}"`,
      Limit: 1,
    }),
  );

  return result.Users?.[0] ?? null;
}

export async function getRoleForEmail(email: string): Promise<AppRole> {
  const user = await findCognitoUserByEmail(email);

  if (!user?.Username) {
    return "user";
  }

  const groups = await listGroupsForUsername(user.Username);
  const role = getRoleFromGroups(groups);

  if (!groups.some((group) => roleGroups.includes(group as AppRole))) {
    await addUserToGroup(user.Username, "user");
    return "user";
  }

  return role;
}

export async function listManagedCognitoUsers(): Promise<CognitoManagedUser[]> {
  const users: UserType[] = [];
  let paginationToken: string | undefined;

  do {
    const result = await cognito.send(
      new ListUsersCommand({
        UserPoolId: COGNITO_USERPOOL_ID,
        Limit: 60,
        PaginationToken: paginationToken,
      }),
    );

    users.push(...(result.Users ?? []));
    paginationToken = result.PaginationToken;
  } while (paginationToken);

  const usersWithGroups = await Promise.all(
    users
      .filter((user) => Boolean(user.Username))
      .map(async (user) => {
        const groups = await listGroupsForUsername(user.Username as string);
        return toManagedUser(user, groups);
      }),
  );

  return usersWithGroups.sort((a, b) => {
    const roleOrder: Record<AppRole, number> = {
      admin: 0,
      moderator: 1,
      user: 2,
    };

    return (
      roleOrder[a.role] - roleOrder[b.role] ||
      a.email.localeCompare(b.email) ||
      a.username.localeCompare(b.username)
    );
  });
}

export async function setCognitoUserRole({
  username,
  nextRole,
  currentAdminEmail,
}: {
  username: string;
  nextRole: "user" | "moderator";
  currentAdminEmail: string;
}) {
  const groups = await listGroupsForUsername(username);

  if (groups.includes("admin")) {
    throw new Error("Admin users cannot be modified from this panel.");
  }

  const targetUserResult = await cognito.send(
    new ListUsersCommand({
      UserPoolId: COGNITO_USERPOOL_ID,
      Filter: `username = "${escapeCognitoFilterValue(username)}"`,
      Limit: 1,
    }),
  );

  const targetUser = targetUserResult.Users?.[0];
  const targetEmail = targetUser ? getUserAttribute(targetUser, "email") : "";

  if (
    targetEmail &&
    currentAdminEmail &&
    targetEmail.toLowerCase() === currentAdminEmail.toLowerCase()
  ) {
    throw new Error("You cannot change your own role from this panel.");
  }

  for (const group of roleGroups) {
    if (group === "admin") continue;

    if (groups.includes(group)) {
      await removeUserFromGroup(username, group);
    }
  }

  await addUserToGroup(username, nextRole);

  const updatedGroups = await listGroupsForUsername(username);

  return {
    username,
    role: normalizeRole(nextRole),
    groups: updatedGroups,
  };
}