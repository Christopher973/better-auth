"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { authClient } from "@/src/lib/auth-client";
import { Badge } from "@/src/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

type User = {
  id: string;
  name: string;
  email: string;
  banned?: boolean;
  role: "admin" | "user";
};

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authClient.admin
      .listUsers({ query: { limit: 10 } })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message ?? "Une erreur inconnue s'est produite");
        } else {
          setUsers(
            (data?.users || []).map((user) => ({
              id: user.id,
              name: user.name,
              email: user.email,
              // On force banned à boolean (jamais null/undefined)
              banned: !!user.banned,
              // On force le role à "admin" ou "user" (jamais undefined ou autre string)
              role: user.role === "admin" ? "admin" : "user",
            }))
          );
        }
      });
  }, []);

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="py-2">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <span>{user.name}</span>
                <span>{user.email}</span>
                {user.banned === true ? (
                  <Badge variant="destructive">Banned</Badge>
                ) : (
                  <Badge variant="outline">Active</Badge>
                )}
                <span>
                  <Badge variant="default">{user.role}</Badge>
                </span>
              </div>
              <div>
                <ul className="flex gap-2">
                  <li>
                    <Select
                      defaultValue={user.role}
                      onValueChange={async (value) => {
                        await authClient.admin.setRole(
                          {
                            userId: user.id,
                            role: value as "admin" | "user",
                          },
                          {
                            onSuccess: () => {
                              authClient.admin
                                .listUsers({ query: { limit: 10 } })
                                .then(({ data }) =>
                                  setUsers(
                                    (data?.users || []).map((user) => ({
                                      id: user.id,
                                      name: user.name,
                                      email: user.email,
                                      banned: !!user.banned,
                                      role:
                                        user.role === "admin"
                                          ? "admin"
                                          : "user",
                                    }))
                                  )
                                );
                            },
                          }
                        );
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles</SelectLabel>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </li>
                  <li>
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      onClick={async () => {
                        await authClient.admin.banUser(
                          {
                            userId: user.id,
                            banReason: "No subscription provided",
                          },
                          {
                            onSuccess: () => {
                              authClient.admin
                                .listUsers({ query: { limit: 10 } })
                                .then(({ data }) =>
                                  setUsers(
                                    (data?.users || []).map((user) => ({
                                      id: user.id,
                                      name: user.name,
                                      email: user.email,
                                      banned: !!user.banned,
                                      role:
                                        user.role === "admin"
                                          ? "admin"
                                          : "user",
                                    }))
                                  )
                                );
                            },
                          }
                        );
                      }}
                    >
                      Ban user
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      onClick={async () => {
                        await authClient.admin.unbanUser(
                          {
                            userId: user.id,
                          },
                          {
                            onSuccess: () => {
                              authClient.admin
                                .listUsers({ query: { limit: 10 } })
                                .then(({ data }) =>
                                  setUsers(
                                    (data?.users || []).map((user) => ({
                                      id: user.id,
                                      name: user.name,
                                      email: user.email,
                                      banned: !!user.banned,
                                      role:
                                        user.role === "admin"
                                          ? "admin"
                                          : "user",
                                    }))
                                  )
                                );
                            },
                          }
                        );
                      }}
                    >
                      Unban user
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
