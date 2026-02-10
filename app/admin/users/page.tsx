"use client";

import { useState } from "react";
import { User } from "@/types/user";
import UserList from "./UserList";
import UserCreate from "./UserCreate";

export default function UserManagementPage() {
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateNew = () => {
    setSelectedUser(null);
    setView("create");
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setView("edit");
  };

  const handleSuccess = () => {
    setView("list");
    setSelectedUser(null);
    setRefreshKey((prev) => prev + 1); // Force refresh the list
  };

  const handleCancel = () => {
    setView("list");
    setSelectedUser(null);
  };

  return (
    <div>
      {view === "list" && (
        <UserList
          key={refreshKey}
          onEdit={handleEdit}
          onCreateNew={handleCreateNew}
        />
      )}

      {(view === "create" || view === "edit") && (
        <UserCreate
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          editUser={selectedUser}
        />
      )}
    </div>
  );
}
