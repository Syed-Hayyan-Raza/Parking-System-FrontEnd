import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  LogOut, 
  DollarSign,
  TrendingUp,
  Clock,
  MapPin,
  Building2
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

// Parking locations data
const parkingLocations = [
  { id: "loc1", name: "Downtown Plaza", address: "123 Main St, Downtown", totalSlots: 50, occupied: 29, revenue: 450 },
  { id: "loc2", name: "City Mall Parking", address: "456 Shopping Ave, Central", totalSlots: 100, occupied: 55, revenue: 820 },
  { id: "loc3", name: "Airport Terminal", address: "789 Airport Rd, North", totalSlots: 200, occupied: 113, revenue: 1240 },
  { id: "loc4", name: "Business District", address: "321 Corporate Blvd, East", totalSlots: 75, occupied: 63, revenue: 630 },
];

export function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for charts
  const usageData = [
    { name: "Mon", bookings: 45, revenue: 225 },
    { name: "Tue", bookings: 52, revenue: 260 },
    { name: "Wed", bookings: 38, revenue: 190 },
    { name: "Thu", bookings: 65, revenue: 325 },
    { name: "Fri", bookings: 78, revenue: 390 },
    { name: "Sat", bookings: 92, revenue: 460 },
    { name: "Sun", bookings: 58, revenue: 290 },
  ];

  const occupancyData = [
    { name: "Available", value: 42, color: "#22c55e" },
    { name: "Occupied", value: 58, color: "#ef4444" },
  ];

  const peakHoursData = [
    { hour: "6 AM", count: 12 },
    { hour: "9 AM", count: 45 },
    { hour: "12 PM", count: 68 },
    { hour: "3 PM", count: 52 },
    { hour: "6 PM", count: 82 },
    { hour: "9 PM", count: 38 },
  ];

  // Mock users data
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "+1 555-0101", totalBookings: 24, status: "Active" },
    { id: 2, name: "Sarah Smith", email: "sarah@example.com", phone: "+1 555-0102", totalBookings: 18, status: "Active" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "+1 555-0103", totalBookings: 31, status: "Active" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", phone: "+1 555-0104", totalBookings: 12, status: "Inactive" },
    { id: 5, name: "David Wilson", email: "david@example.com", phone: "+1 555-0105", totalBookings: 27, status: "Active" },
  ];

  // Mock vehicles data
  const vehicles = [
    { id: 1, plateNumber: "ABC-1234", owner: "John Doe", model: "Toyota Camry", color: "Silver", lastParked: "2025-10-24" },
    { id: 2, plateNumber: "XYZ-5678", owner: "Sarah Smith", model: "Honda Civic", color: "Blue", lastParked: "2025-10-24" },
    { id: 3, plateNumber: "DEF-9012", owner: "Mike Johnson", model: "Ford Mustang", color: "Red", lastParked: "2025-10-23" },
    { id: 4, plateNumber: "GHI-3456", owner: "Emily Davis", model: "Tesla Model 3", color: "White", lastParked: "2025-10-22" },
    { id: 5, plateNumber: "JKL-7890", owner: "David Wilson", model: "BMW X5", color: "Black", lastParked: "2025-10-24" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <h2 className="text-[#1E3A8A]" style={{ fontSize: '1.875rem', fontWeight: 600 }}>
              Dashboard Overview
            </h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white shadow-md border-0 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 mb-1">Total Revenue</p>
                      <p className="text-[#1E3A8A]" style={{ fontSize: '1.875rem', fontWeight: 600 }}>$2,140</p>
                      <p className="text-green-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-4 h-4" />
                        <span style={{ fontSize: '0.875rem' }}>+12.5%</span>
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-md border-0 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 mb-1">Total Users</p>
                      <p className="text-[#1E3A8A]" style={{ fontSize: '1.875rem', fontWeight: 600 }}>1,248</p>
                      <p className="text-green-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-4 h-4" />
                        <span style={{ fontSize: '0.875rem' }}>+8.2%</span>
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#2563EB]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-md border-0 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 mb-1">Total Bookings</p>
                      <p className="text-[#1E3A8A]" style={{ fontSize: '1.875rem', fontWeight: 600 }}>428</p>
                      <p className="text-green-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-4 h-4" />
                        <span style={{ fontSize: '0.875rem' }}>+15.3%</span>
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-md border-0 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 mb-1">Occupancy Rate</p>
                      <p className="text-[#1E3A8A]" style={{ fontSize: '1.875rem', fontWeight: 600 }}>58%</p>
                      <p className="text-orange-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-4 h-4" />
                        <span style={{ fontSize: '0.875rem' }}>+5.1%</span>
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-md border-0 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-[#1E3A8A]">Weekly Bookings & Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="bookings" stroke="#2563EB" strokeWidth={2} name="Bookings" />
                      <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} name="Revenue ($)" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-md border-0 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-[#1E3A8A]">Current Occupancy</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={occupancyData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {occupancyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white shadow-md border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-[#1E3A8A]">Peak Hours Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={peakHoursData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="hour" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2563EB" name="Bookings" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        );

      case "users":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[#1E3A8A]" style={{ fontSize: '1.875rem', fontWeight: 600 }}>
                User Management
              </h2>
              <Button className="bg-[#2563EB] hover:bg-[#1E3A8A]">
                Add New User
              </Button>
            </div>

            <Card className="bg-white shadow-md border-0 rounded-xl">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-4 text-[#1E3A8A]" style={{ fontWeight: 600 }}>Name</th>
                        <th className="text-left py-4 px-4 text-[#1E3A8A]" style={{ fontWeight: 600 }}>Email</th>
                        <th className="text-left py-4 px-4 text-[#1E3A8A]" style={{ fontWeight: 600 }}>Phone</th>
                        <th className="text-left py-4 px-4 text-[#1E3A8A]" style={{ fontWeight: 600 }}>Bookings</th>
                        <th className="text-left py-4 px-4 text-[#1E3A8A]" style={{ fontWeight: 600 }}>Status</th>
                        <th className="text-left py-4 px-4 text-[#1E3A8A]" style={{ fontWeight: 600 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-[#F3F4F6] transition-colors">
                          <td className="py-4 px-4 text-gray-700" style={{ fontWeight: 500 }}>{user.name}</td>
                          <td className="py-4 px-4 text-gray-600">{user.email}</td>
                          <td className="py-4 px-4 text-gray-600">{user.phone}</td>
                          <td className="py-4 px-4 text-gray-700">{user.totalBookings}</td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-lg ${
                                user.status === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                              style={{ fontWeight: 600, fontSize: '0.875rem' }}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Button variant="ghost" size="sm" className="text-[#2563EB] hover:text-[#1E3A8A]">
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "locations":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[#1E3A8A]" style={{ fontSize: '1.875rem', fontWeight: 600 }}>
                Location Management
              </h2>
              <Button className="bg-[#2563EB] hover:bg-[#1E3A8A]">
                Add New Location
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {parkingLocations.map((location) => (
                <Card key={location.id} className="bg-white shadow-md border-0 rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 bg-[#F3F4F6] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-6 h-6 text-[#2563EB]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[#1E3A8A] mb-1" style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                            {location.name}
                          </h3>
                          <p className="text-gray-600 flex items-start gap-1" style={{ fontSize: '0.875rem' }}>
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {location.address}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-[#2563EB] hover:text-[#1E3A8A] flex-shrink-0">
                        Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-gray-500 mb-1" style={{ fontSize: '0.875rem' }}>Total Slots</p>
                        <p className="text-[#1E3A8A]" style={{ fontWeight: 600 }}>{location.totalSlots}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1" style={{ fontSize: '0.875rem' }}>Occupied</p>
                        <p className="text-orange-600" style={{ fontWeight: 600 }}>{location.occupied}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1" style={{ fontSize: '0.875rem' }}>Revenue</p>
                        <p className="text-green-600" style={{ fontWeight: 600 }}>${location.revenue}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#2563EB] h-2 rounded-full transition-all" 
                          style={{ width: `${(location.occupied / location.totalSlots) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-gray-600 mt-2" style={{ fontSize: '0.875rem' }}>
                        {((location.occupied / location.totalSlots) * 100).toFixed(0)}% Occupancy
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "vehicles":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[#1E3A8A]" style={{ fontSize: '1.875rem', fontWeight: 600 }}>
                Vehicle Management
              </h2>
              <Button className="bg-[#2563EB] hover:bg-[#1E3A8A]">
                Add New Vehicle
              </Button>
            </div>

            <Card className="bg-white shadow-md border-0 rounded-xl">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-4 text-[#1E3A8A]" style={{ fontWeight: 600 }}>Plate Number</th>
                        <th className="text-left py-4 px-4 text-[#1E3A8A]" style={{ fontWeight: 600 }}>Owner</th>
                        <th className="text-left py-4 px-4 text-[#1E3A8A]" style={{ fontWeight: 600 }}>Model</th>
                        <th className="text-left py-4 px-4 text-[#1E3A8A]" style={{ fontWeight: 600 }}>Color</th>
                        <th className="text-left py-4 px-4 text-[#1E3A8A]" style={{ fontWeight: 600 }}>Last Parked</th>
                        <th className="text-left py-4 px-4 text-[#1E3A8A]" style={{ fontWeight: 600 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map((vehicle) => (
                        <tr key={vehicle.id} className="border-b border-gray-100 hover:bg-[#F3F4F6] transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-[#F3F4F6] rounded-lg flex items-center justify-center">
                                <Car className="w-4 h-4 text-[#2563EB]" />
                              </div>
                              <span className="text-gray-700" style={{ fontWeight: 600 }}>{vehicle.plateNumber}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-700">{vehicle.owner}</td>
                          <td className="py-4 px-4 text-gray-600">{vehicle.model}</td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg" style={{ fontSize: '0.875rem' }}>
                              {vehicle.color}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-600">{vehicle.lastParked}</td>
                          <td className="py-4 px-4">
                            <Button variant="ghost" size="sm" className="text-[#2563EB] hover:text-[#1E3A8A]">
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="lg:w-64 bg-white shadow-md lg:min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-[#1E3A8A]" style={{ fontSize: '1.25rem', fontWeight: 600 }}>Admin Panel</span>
            </div>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "overview"
                    ? "bg-[#2563EB] text-white"
                    : "text-gray-700 hover:bg-[#F3F4F6]"
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span style={{ fontWeight: activeTab === "overview" ? 600 : 400 }}>Overview</span>
              </button>
              <button
                onClick={() => setActiveTab("locations")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "locations"
                    ? "bg-[#2563EB] text-white"
                    : "text-gray-700 hover:bg-[#F3F4F6]"
                }`}
              >
                <Building2 className="w-5 h-5" />
                <span style={{ fontWeight: activeTab === "locations" ? 600 : 400 }}>Locations</span>
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "users"
                    ? "bg-[#2563EB] text-white"
                    : "text-gray-700 hover:bg-[#F3F4F6]"
                }`}
              >
                <Users className="w-5 h-5" />
                <span style={{ fontWeight: activeTab === "users" ? 600 : 400 }}>Users</span>
              </button>
              <button
                onClick={() => setActiveTab("vehicles")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "vehicles"
                    ? "bg-[#2563EB] text-white"
                    : "text-gray-700 hover:bg-[#F3F4F6]"
                }`}
              >
                <Car className="w-5 h-5" />
                <span style={{ fontWeight: activeTab === "vehicles" ? 600 : 400 }}>Vehicles</span>
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('user');  // Clear user data
                  onNavigate("home");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
