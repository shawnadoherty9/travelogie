import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  guideName: string;
  guideEmail: string;
  clientName: string;
  clientEmail: string;
  tourDetails: {
    location: string;
    date: string;
    duration: string;
    experiences: string[];
    totalPrice: number;
    guideRate: number;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      guideName, 
      guideEmail, 
      clientName, 
      clientEmail, 
      tourDetails 
    }: BookingEmailRequest = await req.json();

    const platformCommission = (tourDetails.totalPrice * 0.15).toFixed(2);
    const guideEarnings = (tourDetails.totalPrice - parseFloat(platformCommission)).toFixed(2);

    const emailSubject = `Tour Booking Request from ${clientName} via Travelogie`;
    
    const emailContent = `
Dear ${guideName},

You have received a new tour booking request through Travelogie!

CLIENT INFORMATION:
• Name: ${clientName}
• Email: ${clientEmail}

TOUR DETAILS:
• Location: ${tourDetails.location}
• Date: ${tourDetails.date}
• Duration: ${tourDetails.duration}
• Total Price: $${tourDetails.totalPrice}
• Your Rate: $${tourDetails.guideRate}/day

EXPERIENCES REQUESTED:
${tourDetails.experiences.map(exp => `• ${exp}`).join('\n')}

PAYMENT BREAKDOWN:
• Total Tour Value: $${tourDetails.totalPrice}
• Platform Commission (15%): $${platformCommission}
• Your Earnings: $${guideEarnings}

To confirm this booking:
1. Reply to this email confirming your availability
2. We will process the client's payment
3. Upon confirmation, tickets will be auto-purchased
4. You'll receive payment within 24 hours of tour completion

If you have any questions or need to modify the itinerary, please contact us directly.

Best regards,
The Travelogie Team

---
This booking request was sent via Travelogie - Learn from Locals
Visit: https://travelogie.io
    `;

    const emailResponse = await resend.emails.send({
      from: "Travelogie <bookings@travelogie.io>",
      to: [guideEmail],
      cc: [clientEmail],
      subject: emailSubject,
      text: emailContent,
    });

    console.log("Booking email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);