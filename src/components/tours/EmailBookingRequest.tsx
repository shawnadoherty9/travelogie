import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, User, Calendar, MapPin, DollarSign } from 'lucide-react';

interface EmailBookingRequestProps {
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
  onSendRequest: () => void;
}

export const EmailBookingRequest: React.FC<EmailBookingRequestProps> = ({
  guideName,
  guideEmail,
  clientName,
  clientEmail,
  tourDetails,
  onSendRequest
}) => {
  const emailSubject = `Tour Booking Request from ${clientName} via Travelogie`;
  const platformCommission = (tourDetails.totalPrice * 0.15).toFixed(2);
  const guideEarnings = (tourDetails.totalPrice - parseFloat(platformCommission)).toFixed(2);

  const emailBody = `
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
  `.trim();

  const handleSendEmail = () => {
    // In a real implementation, this would call the email edge function
    const mailtoLink = `mailto:${guideEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink, '_blank');
    onSendRequest();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Booking Request Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4" />
              <span className="font-medium">Guide:</span>
              <span>{guideName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4" />
              <span className="font-medium">Email:</span>
              <span>{guideEmail}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Location:</span>
              <span>{tourDetails.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Date:</span>
              <span>{tourDetails.date}</span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-muted/30">
          <h4 className="font-medium mb-2">Email Preview:</h4>
          <div className="text-sm bg-background border rounded p-3 max-h-48 overflow-y-auto">
            <pre className="whitespace-pre-wrap font-sans text-xs">
              {emailBody}
            </pre>
          </div>
        </div>

        <div className="grid gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800">Payment Breakdown:</h4>
          <div className="grid gap-1 text-sm">
            <div className="flex justify-between">
              <span>Total Tour Value:</span>
              <span className="font-medium">${tourDetails.totalPrice}</span>
            </div>
            <div className="flex justify-between text-orange-600">
              <span>Platform Commission (15%):</span>
              <span className="font-medium">-${platformCommission}</span>
            </div>
            <div className="flex justify-between text-green-600 font-medium border-t pt-1">
              <span>Guide Earnings:</span>
              <span>${guideEarnings}</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSendEmail}
          className="w-full bg-gradient-wanderlust hover:opacity-90"
          size="lg"
        >
          <Mail className="w-4 h-4 mr-2" />
          Send Booking Request
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          The guide will receive this email and can confirm or modify the booking request.
          Payment will be processed upon confirmation.
        </p>
      </CardContent>
    </Card>
  );
};