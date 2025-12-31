import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Package, Database } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { API_ROUTES } from '@/constants/api-routes';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
  });
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // TODO products/stats
      const response = await api.get(API_ROUTES.STATS);
      setStats({totalProducts: 0});
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Welcome again! lets manage our trash.</p>
        </div>
        {/* TODO stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="border-l-4 border-l-indigo-600">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">All products</CardTitle>
              <Package className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-slate-400">+2 this week</p>
            </CardContent>
          </Card>
        </div>

        {/* navigation */}
        <h2 className="text-xl font-semibold mb-6">Zarządzanie</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Link to products */}
          <Card 
            className="group hover:border-indigo-600 transition-all cursor-pointer"
            onClick={() => navigate(ROUTES.DASHBOARD.PRODUCTS)}
          >
            <CardHeader>
              <div className="p-3 w-fit bg-indigo-50 text-indigo-600 rounded-lg mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Package size={24} />
              </div>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage products.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <ArrowRight size={20} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
            </CardContent>
          </Card>

          {/* Link do Historii Sprzedaży */}
          <Card 
            className="group hover:border-indigo-600 transition-all cursor-pointer"
            onClick={() => navigate(ROUTES.DASHBOARD.INVENTORY)}
          >
            <CardHeader>
              <div className="p-3 w-fit bg-indigo-50 text-indigo-600 rounded-lg mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Database size={24} />
              </div>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Manage inventory.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <ArrowRight size={20} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
            </CardContent>
          </Card>
          

          {/* Link do Ustawień Konta */}
          {/* <Card 
            className="group hover:border-slate-900 transition-all cursor-pointer"
            onClick={() => navigate(ROUTES.PROFILE)}
          >
            <CardHeader>
              <div className="p-3 w-fit bg-slate-100 text-slate-900 rounded-lg mb-2 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <Settings size={24} />
              </div>
              <CardTitle>Ustawienia</CardTitle>
              <CardDescription>Zmień hasło, nazwę użytkownika lub wyloguj się.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <ArrowRight size={20} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
            </CardContent>
          </Card> */}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
