import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, PlusIcon, SearchIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { User } from "@/types/user";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Separator } from "../ui/separator";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import { QUERY_KEYS } from "@/api/queryKeys";
import { userApi } from "@/api/user";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../ui/spinner";

interface ProjectTaskAssigneeProps {
  assignee?: { id: string }[];
  onAssigneeSelect: (assignees: { id: string }[]) => void;
}

export default function ProjectTaskAssigneeSelection(
  props: ProjectTaskAssigneeProps
) {
  const [search, setSearch] = useState("");
  const [isAssigneePopoverOpen, setIsAssigneePopoverOpen] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  const { data: users, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: () => userApi.getUsers(),
    staleTime: 1000 * 60 * 5, // 5 min stale time
  });

  useEffect(() => {
    setSelectedAssignees(props.assignee?.map((a) => a.id) ?? []);
  }, [props.assignee]);

  const assigneeSet = new Set(selectedAssignees);

  const handleToggleAssignee = (userId: string) => {
    let updated: string[];

    if (assigneeSet.has(userId)) {
      // Remove
      updated = selectedAssignees.filter((id) => id !== userId);
    } else {
      // Add
      updated = [...selectedAssignees, userId];
    }

    setSelectedAssignees(updated);
    props.onAssigneeSelect(updated.map((id) => ({ id })));
  };

  const filteredUsers: User[] = users?.filter((u: User) =>
    u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Popover
        open={isAssigneePopoverOpen}
        onOpenChange={setIsAssigneePopoverOpen}
      >
        <PopoverTrigger asChild>
          <div>
            {props.assignee && props.assignee?.length === 0 ? (
              <UserIcon className="w-6 h-6 aspect-square cursor-pointer rounded-md px-[3px] border border-border" />
            ) : (
              <div className="cursor-pointer *:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                {users
                  ?.filter((user: User) => assigneeSet.has(user.id))
                  .map((user: User) => (
                    <Avatar key={user.id} className="w-6 h-6">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt={user.fullName}
                      />
                      <AvatarFallback>
                        {user.fullName?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-2">
          <InputGroup className="shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0">
            <InputGroupInput
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          <Separator className="my-2" />
          <div>
            <div className="flex justify-center">
              {isLoading && <Spinner className="size-5" />}
            </div>
            {!isLoading &&
              filteredUsers &&
              filteredUsers?.map((user: User) => {
                const isAssigned = assigneeSet.has(user.id);
                return (
                  <Item
                    variant="outline"
                    key={user.id}
                    className="p-2 border-none hover:bg-accent cursor-pointer"
                    onClick={() => handleToggleAssignee(user.id)}
                  >
                    <ItemMedia>
                      <Avatar className="w-6 h-6">
                        <AvatarImage
                          src="https://github.com/evilrabbit.png"
                          alt="@evilrabbit"
                        />
                        <AvatarFallback>ER</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{user.fullName}</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      {isAssigned ? (
                        <Check className="size-4 text-success" />
                      ) : (
                        <PlusIcon className="size-4 text-muted-foreground" />
                      )}
                    </ItemActions>
                  </Item>
                );
              })}
            {!isLoading && filteredUsers.length === 0 && (
              <Item variant="outline" className="p-2 border-none">
                <ItemContent>
                  <ItemTitle>No user found!</ItemTitle>
                </ItemContent>
              </Item>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
