import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Plus, Minus, Trash2, Banknote, Search, Badge } from 'lucide-react';
import { API_ROUTES } from '@/constants/api-routes';
import { useTitle } from '@/hooks/useTitle';
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

const Sales = () => {
  useTitle('Solds');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get(API_ROUTES.PRODUCTS.GET_ALL);
      setProducts(response.data);
    } catch (error) {
      toast.error("Unable to find any products in inventory");
    }
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error("No product in inventory!");
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        updateQuantity(product.id, 1);
        return prev;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        if(delta>0 && item.stock <= item.quantity)
          return item;
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSale = async () => {
    try {
      const payload = {
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
        })),
      };
      await api.post(API_ROUTES.SALES.CREATE, payload);
      
      toast.success("Sold saved!", {
        description: `Total: ${totalPrice} $`,
      });
      setCart([]);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to finalize sale during given time");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="max-w-400 mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* left side: products */}
          {/* TODO tab with products with 0 stock */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-3xl font-bold tracking-tight">Shopping Terminal</h1>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Szukaj produktu..." 
                  className="pl-10 bg-white" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <Card 
                  key={product.id} 
                  className="cursor-pointer hover:border-indigo-500 transition-all active:scale-95"
                  onClick={() => addToCart(product)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm truncate">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xl font-black text-indigo-600">{product.price} $</p>
                    <p className="text-xs text-slate-400 mt-1">Stock: {product.stock} items</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* right side: CART */}
          <div className="lg:col-span-4">
            <Card className="sticky top-24 h-[calc(100vh-120px)] flex flex-col shadow-xl border-2 border-indigo-100">
              {/* bar */}
              <CardHeader className="bg-indigo-600 text-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart size={20} /> Card
                  </CardTitle>
                  <Badge >{cart.length} pozycji</Badge>
                </div>
              </CardHeader>

              {/* card container */}
              <CardContent className="grow p-0 overflow-hidden">
                <ScrollArea className="h-full p-4">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                      <ShoppingCart size={48} className="mb-2 opacity-20" />
                      <p>Card is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between border-b pb-4">
                          <div className="grow">
                            <p className="font-bold text-sm truncate w-40">{item.name}</p>
                            <p className="text-xs text-indigo-600 font-bold">{item.price} $</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(item.id, -1)}>
                              <Minus size={14} />
                            </Button>
                            <span className="font-bold w-4 text-center">{item.quantity}</span>
                            <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(item.id, 1)}>
                              <Plus size={14} />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => removeFromCart(item.id)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>

              {/* total cost and sold button */}
              <CardFooter className="flex flex-col border-t p-6 gap-4 bg-slate-50">
                <div className="flex justify-between w-full text-xl font-black uppercase">
                  <span>Total:</span>
                  <span>{totalPrice.toFixed(2)} $</span>
                </div>
                <Button 
                  className="w-full h-16 text-xl font-bold bg-green-600 hover:bg-green-700 shadow-lg"
                  disabled={cart.length === 0}
                  onClick={handleSale}
                >
                  <Banknote className="mr-2" /> SOLD
                </Button>
              </CardFooter>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Sales;