import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Tag, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useCart } from '../context/CartContext';
import { useOrder } from '../hooks/useOrder';
import { WhatsAppModal } from '../components/WhatsAppModal';
import { toast } from 'sonner';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, setWhatsAppNumber, setSplitBill, clearCart } = useCart();
  const { placeOrder, loading } = useOrder();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [splitEnabled, setSplitEnabled] = useState(false);
  const [splitCount, setSplitCount] = useState(2);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<any>(null);

  const subtotal = getCartTotal();
  const tax = subtotal * 0.09; // 9% tax
  const total = subtotal + tax - discount;
  const splitAmount = splitEnabled ? total / splitCount : total;

  const tableNumber = localStorage.getItem('tableNumber') || undefined;

  const handleApplyPromo = () => {
    // Mock promo validation
    const promoCodes: Record<string, number> = {
      'WELCOME10': 10,
      'SAVE20': 20,
    };

    const discountPercent = promoCodes[promoCode.toUpperCase()];
    if (discountPercent) {
      const discountAmount = (subtotal * discountPercent) / 100;
      setDiscount(discountAmount);
      toast.success(`${discountPercent}% discount applied!`);
    } else {
      toast.error('Invalid promo code');
    }
  };

  const handlePlaceOrder = async () => {
    const orderData = {
      items: cart,
      subtotal,
      tax,
      discount,
      total,
      tableNumber,
      splitBill: splitEnabled,
      splitCount: splitEnabled ? splitCount : undefined,
      promoCode: promoCode || undefined,
    };

    setPendingOrder(orderData);
    setShowWhatsAppModal(true);
  };

  const handleWhatsAppSubmit = async (phoneNumber: string) => {
    try {
      setWhatsAppNumber(phoneNumber);
      setSplitBill(splitEnabled, splitEnabled ? splitCount : undefined);

      const order = await placeOrder({
        ...pendingOrder,
        whatsappNumber: phoneNumber,
      });

      clearCart();
      setShowWhatsAppModal(false);
      
      toast.success('Order placed successfully!');
      navigate(`/customer/order-status?orderId=${order.id}`);
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground">Add some items to get started</p>
          <Button onClick={() => navigate('/customer/menu')}>View Menu</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/customer/menu')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        {/* Order Summary */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.quantity}x {item.name}
                  {item.variant && ` (${item.variant})`}
                </span>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Promo Code */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Promo Code</h2>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Enter code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              className="h-12"
            />
            <Button onClick={handleApplyPromo} variant="outline" className="h-12">
              Apply
            </Button>
          </div>
          {discount > 0 && (
            <p className="text-sm text-success mt-2">Discount applied: -${discount.toFixed(2)}</p>
          )}
        </Card>

        {/* Split Bill */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <Label htmlFor="split-bill" className="text-lg font-bold cursor-pointer">
                Split Bill
              </Label>
            </div>
            <Switch
              id="split-bill"
              checked={splitEnabled}
              onCheckedChange={(checked) => {
                setSplitEnabled(checked);
                setSplitBill(checked, checked ? splitCount : undefined);
              }}
            />
          </div>
          {splitEnabled && (
            <div className="space-y-2">
              <Label htmlFor="split-count">Number of People</Label>
              <Input
                id="split-count"
                type="number"
                min="2"
                max="10"
                value={splitCount}
                onChange={(e) => {
                  const count = parseInt(e.target.value) || 2;
                  setSplitCount(count);
                  setSplitBill(true, count);
                }}
                className="h-12"
              />
              <p className="text-sm text-muted-foreground">
                ${splitAmount.toFixed(2)} per person
              </p>
            </div>
          )}
        </Card>

        {/* Payment Summary */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Payment Details</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (9%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
            {splitEnabled && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Per Person ({splitCount} people)</span>
                <span>${splitAmount.toFixed(2)}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Place Order Button */}
        <Button
          onClick={handlePlaceOrder}
          size="lg"
          className="w-full h-14 text-base"
          disabled={loading}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </Button>
      </div>

      {/* WhatsApp Modal */}
      <WhatsAppModal
        open={showWhatsAppModal}
        onOpenChange={setShowWhatsAppModal}
        onSubmit={handleWhatsAppSubmit}
      />
    </div>
  );
};
