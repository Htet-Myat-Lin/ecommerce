/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../../components/header/Header";
import { useOrder } from "../../hooks/queries";
import { useProcessPaymentMutation } from "../../hooks/mutations";
import { Spinner, Alert } from "flowbite-react";
import { CreditCard, Lock, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const IMAGE_BASE = "http://localhost:3000/uploads/product-images/";

export function Payment() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { data: orderData, isLoading: orderLoading, error: orderError } = useOrder(orderId || null);
  const { mutate: processPayment, isPending: paymentPending } = useProcessPaymentMutation();

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const order = orderData?.order;

  useEffect(() => {
    if (order?.paymentStatus === "paid") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPaymentSuccess(true);
    }
  }, [order]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    setPaymentError("");
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
    setPaymentError("");
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "").substring(0, 4);
    setCvc(v);
    setPaymentError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError("");

    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 13) {
      setPaymentError("Please enter a valid card number");
      return;
    }

    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      setPaymentError("Please enter a valid expiry date (MM/YY)");
      return;
    }

    if (!cvc || cvc.length < 3) {
      setPaymentError("Please enter a valid CVC");
      return;
    }

    if (!cardholderName) {
      setPaymentError("Please enter cardholder name");
      return;
    }

    processPayment(
      {
        orderId: orderId,
        paymentMethod: "card",
        paymentData: {
          cardNumber: cardNumber.replace(/\s/g, ""),
          expiryDate,
          cvc,
          cardholderName,
        },
      },
      {
        onSuccess: (data) => {
          setPaymentSuccess(true);
          setTransactionId(data.transactionId);
          // Redirect to home after 3 seconds
          setTimeout(() => {
            navigate("/");
          }, 3000);
        },
        onError: (err: any) => {
          setPaymentError(err?.response?.data?.message || "Payment failed. Please try again.");
        },
      }
    );
  };

  if (orderLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="xl" />
        </div>
      </div>
    );
  }

  if (orderError || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-10">
          <Alert color="failure">
            <span>Order not found or you don't have permission to view this order.</span>
          </Alert>
          <Link to="/cart" className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:underline">
            <ArrowLeft size={18} /> Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  if (paymentSuccess || order.paymentStatus === "paid") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-green-600" size={48} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4">Payment Successful!</h1>
            <p className="text-slate-600 mb-2">Your order has been confirmed and payment processed.</p>
            {transactionId && (
              <p className="text-sm text-slate-500 mb-6">
                Transaction ID: <span className="font-mono">{transactionId}</span>
              </p>
            )}
            <p className="text-sm text-slate-500 mb-8">Redirecting to home page...</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/cart" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6">
          <ArrowLeft size={18} /> Back to Cart
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <CreditCard className="text-blue-600" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Payment Details</h1>
                  <p className="text-slate-500 text-sm">Complete your order securely</p>
                </div>
              </div>

              {paymentError && (
                <Alert color="failure" className="mb-6">
                  <XCircle size={20} className="mr-2" />
                  {paymentError}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => {
                      setCardholderName(e.target.value);
                      setPaymentError("");
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                    <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                {/* Expiry and CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      value={cvc}
                      onChange={handleCvcChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                {/* Security Note */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                  <Lock className="text-blue-600 shrink-0 mt-0.5" size={18} />
                  <p className="text-xs text-blue-800">
                    Your payment is secured with 256-bit SSL encryption. This is a mock payment gateway for demonstration purposes.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={paymentPending}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentPending ? (
                    <>
                      <Spinner size="sm" /> Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock size={18} /> Pay ${order.totalPrice.toFixed(2)}
                    </>
                  )}
                </button>
              </form>

              {/* Test Card Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-bold text-slate-700 mb-2">Test Card (Mock Payment):</p>
                <p className="text-xs text-slate-600">
                  Use any card number (ending in 0000 will fail). Expiry: any future date (MM/YY). CVC: any 3-4 digits.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {order.items.map((item: any, index: number) => {
                  const product = typeof item.product === "object" ? item.product : null;
                  // Calculate price: use item.price if available, otherwise calculate from product/variant
                  let itemPrice = item.price;
                  if (!itemPrice && product) {
                    const variant = product.variants?.find((v: any) => v.sku === item.variantSku);
                    const basePrice = variant?.price || product.price || 0;
                    const discountPrice = product.discountPrice;
                    itemPrice = (discountPrice && discountPrice < basePrice) ? discountPrice : basePrice;
                  }
                  const totalItemPrice = (itemPrice || 0) * (item.quantity || 1);
                  
                  return (
                    <div key={index} className="flex gap-4">
                      {product?.images?.[0] && (
                        <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                          <img
                            src={`${IMAGE_BASE}${product.images[0]}`}
                            alt={product.title}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-sm truncate">
                          {product?.title || "Product"}
                        </p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-blue-600">${totalItemPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t-2 border-dashed border-gray-100 space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-900 font-extrabold text-lg">Total</span>
                  <span className="text-2xl font-black text-blue-600">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

