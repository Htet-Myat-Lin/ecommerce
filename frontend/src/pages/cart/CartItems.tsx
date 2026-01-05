import { Spinner } from "flowbite-react";
import { Header } from "../../components/header/Header";
import { useCreateOrderMutation } from "../../hooks/mutations";
import { useCartStore } from "../../store/cartStore";
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const IMAGE_BASE = "http://localhost:3000/uploads/product-images/";

export function CartItems() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const {mutate, isPending} = useCreateOrderMutation()
  const navigate = useNavigate();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 299 || items.length === 0 ? 0 : 20;
  const total = subtotal + shipping
  const cartItems = items.map((i) => ({
      product : i.product._id, 
      quantity : i.quantity, 
      variantSku: i.variantSku,
      price: i.price
    })
  )

  const handleOrder = () => {
    mutate({items: cartItems, totalPrice: total}, {
      onSuccess: (data) => {
        clearCart()
        // Redirect to payment page with order ID
        if (data?.order?._id) {
          navigate(`/payment/${data.order._id}`)
        }
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900">Shopping Cart</h1>
          <p className="text-slate-500 mt-2">
            You have <span className="font-bold text-blue-600">{items.length} unique items</span> in your cart
          </p>
        </header>

        {items.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="text-blue-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Your cart is feeling light</h2>
            <p className="text-slate-500 mt-2 mb-8">Go ahead and explore our latest digital upgrades.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              <ArrowLeft size={18} /> Back to Store
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            
            {/* List of Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                // Find active variant info to display correct label/price
                const variant = item.product.variants.find(v => v.sku === item.variantSku);
                const displayPrice = item.product.discountPrice || variant?.price || item.product.price;

                return (
                  <div key={`${item.product._id}-${item.variantSku}`} 
                       className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 transition-all hover:border-blue-200">
                    
                    {/* Image Area */}
                    <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                      <img 
                        src={`${IMAGE_BASE}${item.product.images[0]}`} 
                        alt={item.product.title}
                        className="w-full h-full object-contain p-2 mix-blend-multiply"
                      />
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg leading-tight hover:text-blue-600 transition-colors">
                            {item.product.title}
                          </h3>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                              SKU: {item.variantSku}
                            </span>
                            {variant && (
                              <span className="text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                                {variant.color} / {variant.storage}
                              </span>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => removeItem(item.product._id, item.variantSku)}
                          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Remove item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="flex justify-between items-end mt-6">
                        {/* Custom Quantity Switcher */}
                        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                          <button 
                            onClick={() => updateQuantity(item.product._id, item.variantSku, item.quantity - 1)}
                            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-600 transition-all"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-10 text-center font-bold text-slate-800 text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product._id, item.variantSku, item.quantity + 1)}
                            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-600 transition-all"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-slate-400 line-through">
                             {item.product.discountPrice ? `$${(variant?.price || item.product.price).toFixed(2)}` : ''}
                          </p>
                          <p className="font-black text-2xl text-slate-900">
                            ${(displayPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold text-slate-900 mb-8">Checkout Summary</h2>
                
                <div className="space-y-5">
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Order Subtotal</span>
                    <span className="text-slate-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Estimated Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-bold" : "text-slate-900"}>
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="pt-5 mt-5 border-t-2 border-dashed border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-900 font-extrabold text-lg">Total Amount</span>
                      <span className="text-3xl font-black text-blue-600">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button disabled={isPending} onClick={handleOrder} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold mt-8 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-3">
                    {isPending ? <Spinner size="sm" /> : "Order Now"}
                  </button>
                  
                  <div className="mt-6 flex flex-col gap-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <ShieldCheck className="text-green-600" size={20} />
                      <span className="text-xs text-slate-600 font-medium">256-bit SSL Secure Encryption</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}