import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validation constants
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;
const MAX_LOCATION_LENGTH = 200;
const MAX_DURATION_LENGTH = 50;
const MAX_EXPERIENCE_LENGTH = 200;
const MAX_EXPERIENCES_COUNT = 50;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email) && email.length <= MAX_EMAIL_LENGTH;
}

function sanitizeText(text: string, maxLength: number): string {
  return text.trim().substring(0, maxLength).replace(/[<>]/g, '');
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

    // Input validation
    if (!guideName || !guideEmail || !clientName || !clientEmail || !tourDetails) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate and sanitize names
    const sanitizedGuideName = sanitizeText(guideName, MAX_NAME_LENGTH);
    const sanitizedClientName = sanitizeText(clientName, MAX_NAME_LENGTH);
    
    if (sanitizedGuideName.length === 0 || sanitizedClientName.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid name format' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate emails
    if (!validateEmail(guideEmail) || !validateEmail(clientEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate tour details
    if (!tourDetails.location || !tourDetails.date || !tourDetails.duration) {
      return new Response(
        JSON.stringify({ error: 'Invalid tour details' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate and sanitize location and duration
    const sanitizedLocation = sanitizeText(tourDetails.location, MAX_LOCATION_LENGTH);
    const sanitizedDuration = sanitizeText(tourDetails.duration, MAX_DURATION_LENGTH);

    // Validate experiences array
    if (!Array.isArray(tourDetails.experiences) || tourDetails.experiences.length > MAX_EXPERIENCES_COUNT) {
      return new Response(
        JSON.stringify({ error: 'Invalid experiences list' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const sanitizedExperiences = tourDetails.experiences.map(exp => 
      sanitizeText(String(exp), MAX_EXPERIENCE_LENGTH)
    );

    // Validate prices
    if (typeof tourDetails.totalPrice !== 'number' || tourDetails.totalPrice <= 0 || tourDetails.totalPrice > 1000000) {
      return new Response(
        JSON.stringify({ error: 'Invalid price' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (typeof tourDetails.guideRate !== 'number' || tourDetails.guideRate <= 0 || tourDetails.guideRate > 1000000) {
      return new Response(
        JSON.stringify({ error: 'Invalid guide rate' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const platformCommission = (tourDetails.totalPrice * 0.15).toFixed(2);
    const guideEarnings = (tourDetails.totalPrice - parseFloat(platformCommission)).toFixed(2);

    const emailSubject = `Tour Booking Request from ${sanitizedClientName} via Travelogie`;
    
    const emailContent = `
Dear ${sanitizedGuideName},

You have received a new tour booking request through Travelogie!

CLIENT INFORMATION:
• Name: ${sanitizedClientName}
• Email: ${clientEmail}

TOUR DETAILS:
• Location: ${sanitizedLocation}
• Date: ${tourDetails.date}
• Duration: ${sanitizedDuration}
• Total Price: $${tourDetails.totalPrice}
• Your Rate: $${tourDetails.guideRate}/day

EXPERIENCES REQUESTED:
${sanitizedExperiences.map(exp => `• ${exp}`).join('\n')}

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
      JSON.stringify({ error: 'Failed to send booking email' }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);