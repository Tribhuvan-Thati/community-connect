import { Building2, Phone, Mail } from "lucide-react";

export function Header() {
  return (
    <header className="gradient-primary text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Building2 className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Community Portal
              </h1>
              <p className="text-white/80 text-sm md:text-base">
                Gated Community Complaint Management System
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Phone className="w-4 h-4" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Mail className="w-4 h-4" />
              <span>support@community.com</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
