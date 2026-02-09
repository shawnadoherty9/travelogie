import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, Ticket, CalendarDays, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface EventBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: {
    id: string;
    name: string;
    start_date?: string;
    end_date?: string;
    venue_name?: string;
    address?: string;
    price_from?: number;
    price_to?: number;
    currency?: string;
  };
}

export const EventBookingModal: React.FC<EventBookingModalProps> = ({
  open,
  onOpenChange,
  event,
}) => {
  const { user } = useAuth();
  const isFree = !event.price_from || event.price_from === 0;
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [ticketCount, setTicketCount] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to book events');
      return;
    }

    if (!guestName.trim() || !guestEmail.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const totalAmount = isFree ? 0 : (event.price_from || 0) * ticketCount;

      const { data, error } = await supabase
        .from('event_bookings')
        .insert({
          event_id: event.id,
          user_id: user.id,
          guest_name: guestName.trim(),
          guest_email: guestEmail.trim(),
          ticket_count: ticketCount,
          booking_type: isFree ? 'rsvp' : 'paid',
          status: isFree ? 'confirmed' : 'pending',
          total_amount: totalAmount,
          currency: event.currency || 'USD',
          payment_status: isFree ? 'not_required' : 'pending',
        })
        .select('confirmation_number')
        .single();

      if (error) throw error;

      setConfirmationNumber(data.confirmation_number);
      setStep('success');
      toast.success(isFree ? 'RSVP confirmed!' : 'Reservation created!');
    } catch (err: any) {
      console.error('Booking error:', err);
      toast.error(err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setGuestName('');
    setGuestEmail('');
    setTicketCount(1);
    setConfirmationNumber('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary" />
                {isFree ? 'RSVP' : 'Reserve Tickets'}
              </DialogTitle>
              <DialogDescription>
                {event.name}
              </DialogDescription>
            </DialogHeader>

            {/* Event summary */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-1.5 text-sm">
              {event.start_date && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {new Date(event.start_date).toLocaleDateString(undefined, {
                      weekday: 'short', month: 'short', day: 'numeric',
                    })}
                    {event.end_date && event.end_date !== event.start_date && (
                      <> – {new Date(event.end_date).toLocaleDateString(undefined, {
                        weekday: 'short', month: 'short', day: 'numeric',
                      })}</>
                    )}
                  </span>
                </div>
              )}
              {(event.venue_name || event.address) && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{event.venue_name || event.address}</span>
                </div>
              )}
              <div className="pt-1">
                <Badge variant={isFree ? 'secondary' : 'default'}>
                  {isFree ? 'Free Event' : `${event.currency || 'USD'} ${event.price_from}${event.price_to ? ` – ${event.price_to}` : ''} per ticket`}
                </Badge>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="guest-name">Full Name</Label>
                <Input
                  id="guest-name"
                  placeholder="Your full name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guest-email">Email</Label>
                <Input
                  id="guest-email"
                  type="email"
                  placeholder="you@example.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticket-count">Number of Tickets</Label>
                <Input
                  id="ticket-count"
                  type="number"
                  min={1}
                  max={10}
                  value={ticketCount}
                  onChange={(e) => setTicketCount(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>

              {!isFree && (
                <div className="text-sm text-muted-foreground border-t border-border pt-3">
                  Total: <span className="font-semibold text-foreground">
                    {event.currency || 'USD'} {((event.price_from || 0) * ticketCount).toFixed(2)}
                  </span>
                  <p className="text-xs mt-1">Payment will be collected via Stripe (coming soon)</p>
                </div>
              )}

              {!user && (
                <p className="text-sm text-destructive">Please sign in to book events.</p>
              )}

              <Button
                type="submit"
                className="w-full"
                variant="wanderlust"
                disabled={loading || !user}
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : isFree ? (
                  'Confirm RSVP'
                ) : (
                  'Reserve Tickets'
                )}
              </Button>
            </form>
          </>
        ) : (
          /* Success step */
          <div className="text-center py-6 space-y-4">
            <CheckCircle className="w-16 h-16 text-primary mx-auto" />
            <div>
              <h3 className="text-xl font-semibold">
                {isFree ? 'RSVP Confirmed!' : 'Reservation Created!'}
              </h3>
              <p className="text-muted-foreground mt-1">{event.name}</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Confirmation Number</p>
              <p className="text-lg font-mono font-bold mt-1">{confirmationNumber}</p>
            </div>

            <p className="text-sm text-muted-foreground">
              {isFree
                ? 'You\'re all set! Show this confirmation at the venue.'
                : 'Your tickets are reserved. Payment via Stripe will be available soon.'}
            </p>

            <Button onClick={handleClose} className="w-full" variant="outline">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
