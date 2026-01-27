import Navbar from '../components/Navbar';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Package, Database, PiggyBank, MapPinned } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Welcome again! lets manage our trash.</p>
        </div>
        {/* TODO stats */}
        

        {/* navigation */}
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

          {/* inventory */}
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

          {/* sales */}
          <Card 
            className="group hover:border-indigo-600 transition-all cursor-pointer"
            onClick={() => navigate(ROUTES.DASHBOARD.SALES)}
          >
            <CardHeader>
              <div className="p-3 w-fit bg-indigo-50 text-indigo-600 rounded-lg mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <PiggyBank size={24} />
              </div>
              <CardTitle>Sales</CardTitle>
              <CardDescription>Manage sales.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <ArrowRight size={20} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
            </CardContent>
          </Card>
          
          {/* Events */}
          <Card 
            className="group "
            // onClick={() => navigate()}
          >
            <CardHeader>
              <div className="p-3 w-fit bg-indigo-50 text-indigo-600 rounded-lg mb-2 transition-colors">
                <MapPinned size={24} />
              </div>
              <CardTitle>Events</CardTitle>
              <CardDescription>
                Manage events.
                <span className="text-sm text-yellow-500 font-semibold">Coming Soon</span>
                </CardDescription>
            </CardHeader>
            {/* <CardContent className="flex justify-end">
              <ArrowRight size={20} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
            </CardContent> */}
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
