import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProjectToolbar({
  setView,
  view,
}: {
  setView: (view: "table" | "cards") => void;
  view: "table" | "cards";
}) {
  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Left: view switch */}
        <div className="flex flex-wrap gap-2">
          {/* <Button variant="outline">Calendar</Button> */}
          <Button
            variant={view === "table" ? "default" : "outline"}
            onClick={() => setView("table")}
          >
            Table
          </Button>
          <Button
            variant={view === "cards" ? "default" : "outline"}
            onClick={() => setView("cards")}
          >
            Cards
          </Button>
          {/* <Button variant="outline">Kanban</Button> */}
        </div>

        {/* Right: filters + new project */}
        <div className="flex flex-wrap gap-2 md:justify-end">
          <Input placeholder="Search..." className="w-full sm:w-[200px]" />
          <Select>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="design">Design</SelectItem>
            </SelectContent>
          </Select>
          {/* <Button variant="outline">+ Filter</Button> */}
          {/* <Button
            onClick={() => {
              setProjectFormMode("create");
              setOpen(true);
            }}
          >
            + New Project
          </Button> */}
        </div>
      </div>
    </>
  );
}
