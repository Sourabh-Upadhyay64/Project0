import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useOrder } from '../hooks/useOrder';
import { OrderStatusBanner } from '../components/OrderStatusBanner';

export const OrderStatusPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { currentOrder, getOrderStatus } = useOrder();

  useEffect(() => {
    if (orderId) {
      getOrderStatus(orderId);
    }
  }, [orderId]);

  if (!orderId || !currentOrder) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Order Not Found</h2>
          <Button onClick={() => navigate('/customer/menu')}>Back to Menu</Button>
        </div>
      </div>
    );
  }

  const isOrderComplete = currentOrder.status === 'served';

  return (
    <div className="min-h-screen bg-background">
      {/* Status Banner */}
      <OrderStatusBanner status={currentOrder.status} orderId={currentOrder.id} />

      {/* Content */}
      <div className="container mx-auto px-4 pt-24 pb-8 max-w-2xl">
        <div className="space-y-6 animate-fade-in">
          {/* Success Message */}
          <Card className="p-8 text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground text-lg mb-1">Order #{currentOrder.id}</p>
            <p className="text-sm text-muted-foreground">
              We'll keep you updated on WhatsApp
            </p>
          </Card>

          {/* Order Summary */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            {currentOrder.items.length > 0 ? (
              <div className="space-y-3">
                {currentOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Order details will appear here</p>
            )}
          </Card>

          {/* Payment Details */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${currentOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${currentOrder.tax.toFixed(2)}</span>
              </div>
              {currentOrder.discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span>-${currentOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">${currentOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            {isOrderComplete && (
              <Button
                onClick={() => navigate(`/customer/feedback?orderId=${currentOrder.id}`)}
                size="lg"
                variant="outline"
                className="w-full h-14 text-base"
              >
                Rate Your Experience
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            )}
            <Button
              onClick={() => navigate('/customer/menu')}
              size="lg"
              className="w-full h-14 text-base"
            >
              Order More Items
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
