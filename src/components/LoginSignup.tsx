import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Car } from "lucide-react";

interface LoginSignupProps {
  onNavigate: (page: string, role?: string) => void;
}

export function LoginSignup({ onNavigate }: LoginSignupProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<string>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [cnic, setCnic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ⚙️ Update this to your Flask backend URL
  const API_BASE = "http://10.24.193.86:5000/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isLogin ? "/login" : "/signup";

      const body = isLogin
        ? { email, password }
        : { 
            full_name: name, 
            email, 
            password, 
            role,
            phone_number: phoneNumber,
            address,
            cnic
          };

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // ✅ Handle successful login/signup
      if (isLogin) {
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          role: data.user.role,
          name: data.user.full_name
        }));
        alert("Login successful!");
        onNavigate(data.user.role === "admin" ? "admin" : "dashboard", data.user.role);
      } else {
        alert("Signup successful! You can now log in.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 rounded-2xl relative z-10">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] rounded-2xl flex items-center justify-center">
              <Car className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-center text-[#1E3A8A]" style={{ fontSize: '1.875rem', fontWeight: 600 }}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-center" style={{ fontSize: '1rem' }}>
            {isLogin ? "Sign in to your account" : "Sign up to get started"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#1E3A8A]">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-lg border-gray-300 focus:border-[#2563EB] focus:ring-[#2563EB]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#1E3A8A]">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+92 300 1234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-12 rounded-lg border-gray-300 focus:border-[#2563EB] focus:ring-[#2563EB]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-[#1E3A8A]">Address</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Your complete address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-12 rounded-lg border-gray-300 focus:border-[#2563EB] focus:ring-[#2563EB]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnic" className="text-[#1E3A8A]">CNIC</Label>
                  <Input
                    id="cnic"
                    type="text"
                    placeholder="XXXXX-XXXXXXX-X"
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    className="h-12 rounded-lg border-gray-300 focus:border-[#2563EB] focus:ring-[#2563EB]"
                    required
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1E3A8A]">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-lg border-gray-300 focus:border-[#2563EB] focus:ring-[#2563EB]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#1E3A8A]">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-lg border-gray-300 focus:border-[#2563EB] focus:ring-[#2563EB]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-[#1E3A8A]">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300 focus:border-[#2563EB] focus:ring-[#2563EB]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#1E3A8A]/90 hover:to-[#2563EB]/90 text-white rounded-lg"
              style={{ fontSize: '1rem', fontWeight: 600 }}
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
            </Button>

            {error && (
              <p className="text-center text-red-500 text-sm">{error}</p>
            )}
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-gray-500">or</span>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#2563EB] hover:text-[#1E3A8A] transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => onNavigate("home")}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
