import { useState } from "react";
import { Header } from "@/components/Header";
import { Features } from "@/components/Features";
import { ComplaintForm } from "@/components/ComplaintForm";
import { SuccessScreen } from "@/components/SuccessScreen";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquarePlus } from "lucide-react";

const Index = () => {
  const [submittedComplaintId, setSubmittedComplaintId] = useState<string | null>(null);

  const handleSuccess = (complaintId: string) => {
    setSubmittedComplaintId(complaintId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewComplaint = () => {
    setSubmittedComplaintId(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <Features />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {submittedComplaintId ? (
          <SuccessScreen
            complaintId={submittedComplaintId}
            onNewComplaint={handleNewComplaint}
          />
        ) : (
          <Card className="max-w-3xl mx-auto shadow-xl rounded-3xl border-0 animate-fade-in">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquarePlus className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl md:text-3xl gradient-text">
                Register Your Complaint
              </CardTitle>
              <CardDescription className="text-base">
                Fill in the details below and we'll get back to you promptly
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <ComplaintForm onSuccess={handleSuccess} />
            </CardContent>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
