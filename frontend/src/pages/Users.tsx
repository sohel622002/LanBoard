import { QUERY_KEYS } from "@/api/queryKeys";
import { userApi } from "@/api/user";
import { Button } from "@/components/ui/button";
import { UserTable } from "@/components/users/user-table";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";

export default function UsersPage() {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: () => userApi.getUsers(),
    staleTime: 1000 * 60 * 5, // 5 min stale time
  });

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  if (error)
    return <p className="text-sm text-destructive">Error fetching users</p>;

  return (
    <>
      <main className="p-4 space-y-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">All Users</h1>
          <Button
          // onClick={() => {
          //   setProjectFormMode("create");
          //   setOpen(true);
          // }}
          >
            <PlusIcon /> New User
          </Button>
        </div>
        <UserTable users={users} />
      </main>
    </>
  );
}
