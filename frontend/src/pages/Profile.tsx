import { useState, useEffect } from 'react';
import api from '@/api/axios';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Shadcn UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Ikonki
import { User, Lock, LogOut, ChevronRight } from "lucide-react";

const Profile = () => {
  const [username, setUsername] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Stany dla zmiany hasła
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [passData, setPassData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/auth/me');
      setUsername(response.data.username);
      setTempUsername(response.data.username);
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  };

  const handleUpdateUsername = async () => {
    try {
      await api.patch('/users/me/username', { username: tempUsername });
      setUsername(tempUsername);
      setIsUserModalOpen(false);
    } catch (error) {
      console.error('Update failed', error);
    }
  };

  const handleUpdatePassword = async () => {
    if (passData.newPassword !== passData.confirmPassword) {
      alert("New password and confirm password are not the same!");
      return;
    }

    try {
      await api.patch('/users/me/password', {
        oldPass: passData.oldPassword,
        newPass: passData.newPassword
      });
      setIsPassModalOpen(false);
      setPassData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      alert("Password has been successfully changed.");
    } catch (error) {
      console.error('Password update failed', error);
      alert("Error: Please ensure that the old password is correct and the new password is not the same as the old one.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Manage your display name and account settings.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            
            {/* username section */}
            <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
              <DialogTrigger asChild>
                <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Username</p>
                      <p className="text-base font-semibold">{username}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change username</DialogTitle>
                  <DialogDescription>
                    Enter a new username. It will be updated immediately.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">New name</Label>
                    <Input
                      id="username"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUserModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleUpdateUsername}>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Separator />

            {/* password section */}
            <Dialog open={isPassModalOpen} onOpenChange={setIsPassModalOpen}>
              <DialogTrigger asChild>
                <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded-full">
                      <Lock size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Password</p>
                      <p className="text-base font-semibold">••••••••••••</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Enter your current password and a new one.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="oldPass">Current password</Label>
                    <Input
                      id="oldPass"
                      type="password"
                      value={passData.oldPassword}
                      onChange={(e) => setPassData({...passData, oldPassword: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="newPass">New password</Label>
                    <Input
                      id="newPass"
                      type="password"
                      value={passData.newPassword}
                      onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPass">Confirm new password</Label>
                    <Input
                      id="confirmPass"
                      type="password"
                      value={passData.confirmPassword}
                      onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPassModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleUpdatePassword}>Update Password</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Separator />

            {/* Logout Button */}
            <div 
              className="flex items-center gap-4 p-4 hover:bg-red-50 transition-colors cursor-pointer group"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <div className="p-2 bg-red-100 text-red-600 rounded-full group-hover:bg-red-200">
                <LogOut size={20} />
              </div>
              <p className="font-semibold text-red-600">Log out</p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;