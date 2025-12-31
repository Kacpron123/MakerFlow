import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, } from 'lucide-react';
import { API_ROUTES } from '@/constants/api-routes';
import { useTitle } from '@/hooks/useTitle';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const Inventory = () => {
  useTitle('Inventory');
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await api.get(API_ROUTES.PRODUCTS.GET_ALL);
    setProducts(res.data);
  };
//   TODO backend stock
  const updateStock = async (id: number, amount: number) => {
    try {
      await api.patch(API_ROUTES.PRODUCTS.STOCK(id), { stock_add: amount });
      setProducts(prev => prev.map(p => 
        p.id === id ? { ...p, stock: p.stock + amount } : p
      ));
    } catch (err) {
      console.error("Stock update failed", err);
    }
  };

  const getStockBadge = (count: number) => {
    if (count <= 0) return <Badge variant="destructive">Out of stock</Badge>;
    if (count < 10) return <Badge variant="outline" className="text-orange-500 border-orange-500">Low stock</Badge>;
    return <Badge variant="secondary" className="bg-green-100 text-green-700">available</Badge>;
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Stock</h1>
            <p className="text-muted-foreground">Manage stock levels and receive deliveries.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj produktu..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-25">ID</TableHead>
                <TableHead>Product name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">number</TableHead>
                <TableHead className="text-right">Quick add</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-xs">#{product.id}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{getStockBadge(product.stock)}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-xl font-bold">{product.stock}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        const amount=product.stock < 5 ? -product.stock : -5;
                        updateStock(product.id, amount);
                        }}
                        disabled={product.stock ==0}>-5</Button>
                      <Button size="sm" variant="outline" onClick={() => updateStock(product.id, -1)} disabled={product.stock < 1}>-1</Button>
                      <Button size="sm" variant="outline" onClick={() => updateStock(product.id, 1)}>+1</Button>
                      <Button size="sm" variant="outline" onClick={() => updateStock(product.id, 5)}>+5</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Not found products.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;