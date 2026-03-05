import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Droplet, Zap, Home, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { id: "water", label: "Water Supply", icon: Droplet },
  { id: "electricity", label: "Electricity", icon: Zap },
  { id: "housekeeping", label: "Housekeeping", icon: Home },
  { id: "security", label: "Security", icon: Shield },
] as const;

const complaintSchema = z.object({
  resident_name: z.string().min(2, "Enter valid name"),
  flat_number: z.string().min(1, "Flat number required"),
  phone_number: z.string().regex(/^[6-9]\d{9}$/, "Enter valid Indian mobile"),
  category: z.enum(["water", "electricity", "housekeeping", "security"]),
  description: z.string().min(10, "Minimum 10 characters"),
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

interface ComplaintFormProps {
  onSuccess: (complaintId: string) => void;
}

export function ComplaintForm({ onSuccess }: ComplaintFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
  });

  const onSubmit = async (data: ComplaintFormData) => {
    setIsSubmitting(true);

    try {
      const payload = {
        resident_name: data.resident_name,
        flat_number: data.flat_number,
        phone_number: data.phone_number,
        portfolio: data.category,
        description: data.description,
      };

      const response = await fetch("http://127.0.0.1:5000/submit-complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const result = await response.json();

      toast({
        title: "Complaint Submitted",
        description: `Complaint ID: ${result.complaint_id}`,
      });

      onSuccess(result.complaint_id);
      form.reset();

    } catch (error) {
      console.error(error);
      toast({
        title: "Submission Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Category</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={cat.id}
                      className={`cursor-pointer border rounded-xl p-4 text-center ${
                        field.value === cat.id
                          ? "border-primary bg-primary/10"
                          : ""
                      }`}
                      onClick={() => field.onChange(cat.id)}
                    >
                      <Icon className="mx-auto mb-2" />
                      <span>{cat.label}</span>
                    </div>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Resident Name */}
        <FormField
          control={form.control}
          name="resident_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resident Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Full Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Flat Number */}
        <FormField
          control={form.control}
          name="flat_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Flat Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="A-101" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Number */}
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="10-digit mobile" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Describe the issue..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            "Submit Complaint"
          )}
        </Button>

      </form>
    </Form>
  );
}
