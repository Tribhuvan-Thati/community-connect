import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Portfolio email mapping
const portfolioEmails: Record<string, { email: string; name: string }> = {
  water: { email: "a22853041@gmail.com", name: "Water Supply Department" },
  electricity: { email: "efgh28099@gmail.com", name: "Electricity Department" },
  housekeeping: { email: "ijkl66708@gmail.com", name: "Housekeeping Department" },
  security: { email: "mnop7875@gmail.com", name: "Security Department" },
};

interface ComplaintNotification {
  complaint_id: string;
  resident_name: string;
  flat_number: string;
  phone_number: string;
  category: string;
  description: string;
  image_url: string | null;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const complaint: ComplaintNotification = await req.json();
    
    console.log("Received complaint notification request:", {
      complaint_id: complaint.complaint_id,
      category: complaint.category,
      flat_number: complaint.flat_number,
    });

    const portfolio = portfolioEmails[complaint.category];
    if (!portfolio) {
      throw new Error(`Unknown category: ${complaint.category}`);
    }

    // Format the email content
    const emailSubject = `[Complaint ${complaint.complaint_id}] New ${complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)} Issue - Flat ${complaint.flat_number}`;
    
    const emailBody = `
Dear ${portfolio.name} Team,

A new complaint has been registered in the Community Portal. Please find the details below:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPLAINT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Complaint ID: ${complaint.complaint_id}
📅 Date: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
🏷️ Category: ${complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESIDENT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Name: ${complaint.resident_name}
🏠 Flat Number: ${complaint.flat_number}
📞 Phone: ${complaint.phone_number}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ISSUE DESCRIPTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${complaint.description}

${complaint.image_url ? `📷 Attached Image: ${complaint.image_url}` : "No image attached."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please take necessary action at the earliest.

Best regards,
Community Portal System
    `.trim();

    // Log the email that would be sent
    console.log("Email notification prepared:");
    console.log("To:", portfolio.email);
    console.log("Subject:", emailSubject);
    console.log("Body preview:", emailBody.substring(0, 200) + "...");

    // Note: To actually send emails, you would need to integrate with Resend or another email service
    // For now, we log the notification and return success
    // To enable email sending, add RESEND_API_KEY secret and uncomment the code below:
    
    /*
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (RESEND_API_KEY) {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Community Portal <noreply@yourdomain.com>",
          to: [portfolio.email],
          subject: emailSubject,
          text: emailBody,
        }),
      });
      
      if (!resendResponse.ok) {
        const error = await resendResponse.text();
        throw new Error(`Failed to send email: ${error}`);
      }
    }
    */

    return new Response(
      JSON.stringify({
        success: true,
        message: "Notification processed successfully",
        portfolio: portfolio.name,
        recipient: portfolio.email,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-complaint-notification:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
