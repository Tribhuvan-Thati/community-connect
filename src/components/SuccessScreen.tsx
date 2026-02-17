import { CheckCircle2, ArrowLeft, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SuccessScreenProps {
  complaintId: string;
  onNewComplaint: () => void;
}

export function SuccessScreen({ complaintId, onNewComplaint }: SuccessScreenProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(complaintId);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Complaint ID copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the ID manually",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md border-0 shadow-2xl rounded-3xl overflow-hidden">
        <div className="gradient-primary p-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center animate-scale-in">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center">
            Complaint Submitted Successfully!
          </h2>
        </div>
        
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">Your Complaint ID is</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-primary">{complaintId}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-housekeeping" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 space-y-2">
            <p className="text-sm text-center text-muted-foreground">
              📧 An email notification has been sent to the concerned department.
            </p>
            <p className="text-sm text-center text-muted-foreground">
              Please save this ID for future reference and tracking.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onNewComplaint}
              className="w-full h-12 rounded-xl gradient-primary hover:opacity-90"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Submit Another Complaint
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
