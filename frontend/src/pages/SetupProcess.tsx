import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, FileCog, Loader2Icon } from "lucide-react";
import type { JSX } from "react/jsx-runtime";
import { usePostgresBinaries } from "@/hooks/usePostgresBinaries";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type ProcessCard = {
  id: number;
  type: "download" | "initialize";
  title: string;
  icon: JSX.Element;
  desc: string;
};

export default function SetupProcess() {
  const navigate = useNavigate();
  const {
    downloadPostgresBinaries,
    process,
    postgresRunning,
    downloadingPostgresBinaries,
    initializingPostgresBinaries,
    postgresBinariesEvent,
    postgresBinariesDownloadProgress,
  } = usePostgresBinaries();
  const processCards: ProcessCard[] = [
    {
      id: 1,
      type: "download",
      title: "Download database binaries",
      icon: <Download />,
      desc: "We’re fetching the Postgres binaries for your local machine",
    },
    {
      id: 2,
      type: "initialize",
      title: "Initialize database",
      icon: <FileCog />,
      desc: "Setting up the Postgres binaries on your local machine",
    },
  ];

  useEffect(() => {
    if (postgresRunning) {
      navigate("/");
    }
  }, [postgresRunning]);

  return (
    <section className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-3xl text-center font-bold text-primary mb-1">
          Setup Database Locally
        </h1>
        <p className="text text-center text-primary mb-5">
          We’ll go through the following steps to set up the database on your
          local machine
        </p>
        {postgresBinariesEvent && (
          <p className="text text-center text-primary mb-5">
            {postgresBinariesEvent}
          </p>
        )}
        <div className="space-y-3">
          {processCards.map((card) => (
            <SetupCard
              key={card.id}
              card={card}
              postgresBinariesDownloadProgress={
                postgresBinariesDownloadProgress
              }
              downloadingPostgresBinaries={downloadingPostgresBinaries}
              initializingPostgresBinaries={initializingPostgresBinaries}
            />
          ))}
        </div>
        <Button
          className="w-full mt-4 cursor-pointer"
          disabled={process}
          onClick={downloadPostgresBinaries}
        >
          Start Setup
        </Button>
        <p className="text-xs text-center font-semibold text-primary mt-4">
          Make sure you’re connected to a stable internet connection and keep
          your computer powered on during this process. <br /> Thanks for
          hanging in there — we’ll be done soon!
        </p>
      </div>
    </section>
  );
}

type SetUpCardProps = {
  card: ProcessCard;
  postgresBinariesDownloadProgress: number;
  downloadingPostgresBinaries: boolean;
  initializingPostgresBinaries: boolean;
};

function SetupCard(props: SetUpCardProps) {
  const {
    card,
    downloadingPostgresBinaries,
    initializingPostgresBinaries,
    postgresBinariesDownloadProgress,
  } = props;
  return (
    <div className="border border-border p-4 rounded-md w-full">
      <div className="flex items-center gap-2 text-primary text-lg font-semibold">
        {card.icon}
        {card.title}
      </div>
      <p className="mt-3 text-sm text-primary font-medium">{card.desc}</p>
      {/* Downloading Progress */}
      {downloadingPostgresBinaries && card.type === "download" && (
        <div className="space-y-2 mt-3">
          <div className="flex items-center justify-between text-primary">
            <span className="text-sm font-medium">
              Downloading... ({postgresBinariesDownloadProgress}%)
            </span>
            {/* <Spinner size={20} primaryColor="fill-primary" /> */}
            {postgresBinariesDownloadProgress > 0 &&
              postgresBinariesDownloadProgress < 100 && (
                <Loader2Icon className="animate-spin" />
              )}
          </div>
          <Progress value={postgresBinariesDownloadProgress} />
        </div>
      )}
      {/* Initializing Progress */}
      {initializingPostgresBinaries && card.type === "initialize" && (
        <div className="space-y-2 mt-3">
          <div className="flex items-center justify-between text-primary">
            <span className="text-sm font-medium">
              Initializing... (This may take a few minutes)
            </span>
            {/* <Spinner size={20} primaryColor="fill-primary" /> */}
            <Loader2Icon className="animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
}
