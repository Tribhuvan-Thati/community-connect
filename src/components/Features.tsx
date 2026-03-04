import { Clock, Bell, FileCheck, HeadphonesIcon } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Quick Response",
    description: "Get responses within 24 hours",
    color: "bg-water text-white",
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    description: "Email alerts to concerned department",
    color: "bg-electricity text-white",
  },
  {
    icon: FileCheck,
    title: "Track Progress",
    description: "Monitor your complaint status",
    color: "bg-housekeeping text-white",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Round the clock assistance",
    color: "bg-security text-white",
  },
];

export function Features() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-sm md:text-base mb-1">{feature.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
