import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";

export default function PreSignup({
  choosePlan,
}: {
  choosePlan: (plan: "solo" | "team") => void;
}) {
  return (
    <div>
      <h1 className="text-4xl text-primary font-bold text-center mb-2">
        How will you use ProjectVault?
      </h1>
      <p className="text-primary text-center max-w-md mx-auto leading-5 mb-5">
        Choose wisely ProjectVault will need to configure server settings based
        on your choice.
      </p>
      <div className="flex gap-8 max-w-4xl w-full">
        {/* Team Card */}
        <Card
          className={`flex-1 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg`}
        >
          <CardContent className="p-0 text-center space-y-5">
            {/* Team Icon */}
            <img
              src="/team-use.svg"
              alt="Team use image"
              className="mx-auto max-w-[250px]"
            />

            {/* Title */}
            <h2 className="text-2xl font-bold text-primary">Use as a Team</h2>

            {/* Description */}
            <p className="text-primary leading-relaxed px-4">
              Collaborate with your teammates and manage projects together.
            </p>

            {/* Continue Button */}
            <Button
              className="w-full font-bold cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                choosePlan("team");
              }}
            >
              Continue
            </Button>
          </CardContent>
        </Card>

        {/* Solo Card */}
        <Card
          className={`flex-1 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg`}
        >
          <CardContent className="p-0 text-center space-y-5">
            {/* Solo Icon - Circle with Checkmark */}
            {/* <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Check className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
              </div>
            </div> */}
            <img
              src="/solo-use.svg"
              alt="Solo use image"
              className="mx-auto max-w-[250px]"
            />

            {/* Title */}
            <h2 className="text-2xl font-bold text-primary">Use Solo</h2>

            {/* Description */}
            <p className="text-primary leading-relaxed px-4">
              Manage your personal projects efficiently and securely.
            </p>

            {/* Continue Button */}
            <Button
              className="w-full font-bold cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                choosePlan("solo");
              }}
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
