import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  LayoutDashboard, 
  BookOpen, 
  CreditCard, 
  User, 
  LogOut, 
  Car,
  Clock,
  Calendar,
  MapPin,
  Building2,
  DollarSign
} from "lucide-react";

interface DashboardProps {
  onNavigate: (page: string) => void;
}


const BASEURL = "http://10.24.193.86:5000/";

// Mock parking locations
const parkingLocations = [
  { id: "loc1", name: "Downtown Plaza", address: "123 Main St, Downtown", totalSlots: 50, rate: 5 }
];

export function Dashboard({ onNavigate }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [duration, setDuration] = useState("2");
  const [selectedLocation, setSelectedLocation] = useState(parkingLocations[0].id);
  const [currentUser, setCurrentUser] = useState<any>(null);
  interface ParkingSlot {
    id: number;
    zone?: string;
    isAvailable: boolean;
    slot_code?: string;
  }

  interface Booking {
    id: number;
    slot_code: string;
    location_name: string;
    created_at: string;
    duration: number;
    vehicle_number: string;
    total_amount: number;
    status?: string;
  }

  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentUser?.id) return;

      try {
        console.log('Fetching profile data for user:', currentUser.id);
        const response = await fetch(`${BASEURL}/user/${currentUser.id}`);
        if (!response.ok) throw new Error('Failed to fetch profile data');
        
        const data = await response.json();
        console.log('Profile data received:', data);
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [currentUser]);

  // Fetch bookings
  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      // Redirect to login if no user data
      onNavigate('login');
      return;
    }
    setCurrentUser(JSON.parse(userData));
  }, [onNavigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser?.id) return;
      
      try {
        // Fetch both bookings and payments in parallel
        const [bookingsResponse, paymentsResponse] = await Promise.all([
          fetch(`${BASEURL}/bookings?user_id=${currentUser.id}`),
          fetch(`${BASEURL}/payments?user_id=${currentUser.id}`)
        ]);

        if (!bookingsResponse.ok) {
          throw new Error('Failed to fetch bookings');
        }
        if (!paymentsResponse.ok) {
          throw new Error('Failed to fetch payments');
        }

        const bookingsData = await bookingsResponse.json();
        const paymentsData = await paymentsResponse.json();

        setBookings(bookingsData);
        setPayments(paymentsData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Fetch parking slots
  useEffect(() => {
    const fetchParkingSlots = async () => {
      try {
        const response = await fetch(`${BASEURL}/slots`);
        if (!response.ok) {
          throw new Error('Failed to fetch parking slots');
        }
        const data = await response.json();

        // Map API fields to component-friendly shape
        // API item example: { id, is_available, location_id, slot_code }
        const mapped: ParkingSlot[] = (Array.isArray(data) ? data : []).map((s: any) => ({
          id: s.id,
          isAvailable: Boolean(s.is_available),
          slot_code: s.slot_code,
          zone: s.slot_code ? String(s.slot_code).split('-')[0] : undefined,
        }));

        setParkingSlots(mapped);
      } catch (error) {
        console.error('Error fetching parking slots:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParkingSlots();
  }, []);

  // Selected slot object (lookup by id) — safer than index arithmetic
  const selectedSlotObj = selectedSlot ? parkingSlots.find(s => s.id === selectedSlot) : undefined;

  // Get current location details
  const currentLocation = parkingLocations.find(loc => loc.id === selectedLocation) || parkingLocations[0];

  // Payment data state
  interface Payment {
    id: number;
    booking_id: number;
    amount: number;
    status: 'Paid' | 'Pending';
    created_at: string;
    vehicle_number: string;
    slot_code: string;
  }

  const [payments, setPayments] = useState<Payment[]>([]);

  // Payments are fetched together with bookings in the user-data effect above
  // (useEffect that depends on currentUser). This prevents fetching all
  // payments publicly and ensures we request payments for the logged-in user only.

  const handleSlotClick = (slot: any) => {
    if (slot.isAvailable) {
      setSelectedSlot(slot.id);
      setShowBookingDialog(true);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlotObj || !vehicleNumber || !duration || !currentUser) {
      return;
    }

    try {
      // Calculate total amount
      const totalAmount = parseFloat(duration) * currentLocation.rate;

      const response = await fetch(`${BASEURL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slot_code: selectedSlotObj.slot_code,
          vehicle_number: vehicleNumber,
          duration: parseInt(duration),
          total_amount: totalAmount,
          user_id: currentUser.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      // Refresh all data
      const [slotsData, bookingsData, paymentsData] = await Promise.all([
        fetch(`${BASEURL}/slots`).then(r => r.json()),
        fetch(`${BASEURL}/bookings?user_id=${currentUser.id}`).then(r => r.json()),
        fetch(`${BASEURL}/payments?user_id=${currentUser.id}`).then(r => r.json())
      ]);
      
      setParkingSlots(slotsData.map((s: any) => ({
        id: s.id,
        isAvailable: Boolean(s.is_available),
        slot_code: s.slot_code,
        zone: s.slot_code ? String(s.slot_code).split('-')[0] : undefined,
      })));
      
      setBookings(bookingsData);
      setPayments(paymentsData);
      
      // Reset form
      setShowBookingDialog(false);
      setVehicleNumber("");
      setDuration("2");
      setSelectedSlot(null);
    } catch (error) {
      console.error('Error creating booking:', error);
      // TODO: Show error to user
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-[#1E3A8A] mb-2" style={{ fontSize: '1.875rem', fontWeight: 600 }}>
                  Available Parking Slots
                </h2>
                <p className="text-gray-600">Click on a green slot to book</p>
              </div>
              <div className="w-full sm:w-auto">
                <Label htmlFor="location-select" className="text-[#1E3A8A] mb-2 block">Select Location</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full sm:w-[280px] h-12 rounded-lg border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {parkingLocations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          {location.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location Info Card */}
            <Card className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white shadow-md border-0 rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1" style={{ fontSize: '1.25rem', fontWeight: 600 }}>{currentLocation.name}</h3>
                    <p className="text-white/90 mb-3">{currentLocation.address}</p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        <span>{currentLocation.totalSlots} Total Slots</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>PKR {currentLocation.rate}/hour</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white shadow-md border-0 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 mb-1">Total Slots</p>
                      <p className="text-[#1E3A8A]" style={{ fontSize: '1.875rem', fontWeight: 600 }}>24</p>
                    </div>
                    <div className="w-12 h-12 bg-[#F3F4F6] rounded-lg flex items-center justify-center">
                      <Car className="w-6 h-6 text-[#2563EB]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-md border-0 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 mb-1">Available</p>
                      <p className="text-green-600" style={{ fontSize: '1.875rem', fontWeight: 600 }}>
                        {parkingSlots.filter(s => s.isAvailable).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-md border-0 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 mb-1">Occupied</p>
                      <p className="text-red-600" style={{ fontSize: '1.875rem', fontWeight: 600 }}>
                        {parkingSlots.filter(s => !s.isAvailable).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Parking Grid */}
            <Card className="bg-white shadow-md border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-[#1E3A8A]">Parking Layout</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {parkingSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => handleSlotClick(slot)}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
                        slot.isAvailable
                          ? "bg-green-100 hover:bg-green-200 border-2 border-green-500 cursor-pointer"
                          : "bg-red-100 border-2 border-red-500 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <Car className={`w-5 h-5 ${slot.isAvailable ? "text-green-700" : "text-red-700"}`} />
                      <span className={`${slot.isAvailable ? "text-green-700" : "text-red-700"}`} style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        {slot.slot_code || `${slot.zone}-${String(slot.id).padStart(2, '0')}`}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-6 mt-6 justify-center flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 border-2 border-green-500 rounded"></div>
                    <span className="text-gray-700">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-100 border-2 border-red-500 rounded"></div>
                    <span className="text-gray-700">Occupied</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "bookings":
        return (
          <div className="space-y-6">
            <h2 className="text-[#1E3A8A]" style={{ fontSize: '1.875rem', fontWeight: 600 }}>
              My Bookings
            </h2>
            <div className="space-y-4">
              {bookings.map((booking) => {
                const bookingDate = new Date(booking.created_at);
                const formattedDate = bookingDate.toLocaleDateString();
                const formattedTime = bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const status = (() => {
                  const now = new Date();
                  const endTime = new Date(bookingDate.getTime() + booking.duration * 60 * 60 * 1000);
                  if (now < bookingDate) return "Upcoming";
                  if (now > endTime) return "Completed";
                  return "Active";
                })();

                return (
                <Card key={booking.id} className="bg-white shadow-md border-0 rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#F3F4F6] rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-[#2563EB]" />
                        </div>
                        <div>
                          <p className="text-[#1E3A8A]" style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                            Slot {booking.slot_code}
                          </p>
                          <p className="text-gray-500 flex items-center gap-1 mt-1">
                            <Building2 className="w-4 h-4" />
                            {booking.location_name}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formattedDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formattedTime}
                            </span>
                            <span>{booking.duration} hours</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-4 py-2 rounded-lg ${
                            status === "Active"
                              ? "bg-green-100 text-green-700"
                              : status === "Upcoming"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                          style={{ fontWeight: 600 }}
                        >
                          {status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )})}
            </div>
          </div>
        );

      case "payments":
        return (
          <div className="space-y-6">
            <h2 className="text-[#1E3A8A]" style={{ fontSize: '1.875rem', fontWeight: 600 }}>
              Payment History
            </h2>
            <div className="grid gap-4">
              {payments.map((payment) => (
                <Card key={payment.id} className="bg-white shadow-md border-0 rounded-xl">
                  <CardContent className="p-6">
                    {payment.status === 'Pending' && (
                      <div className="mb-4 flex justify-end">
                        <Button className="bg-[#2563EB] hover:bg-[#1E3A8A] text-white" size="sm" disabled>
                          Pay Now
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-gray-500">Date:</span>
                          <span className="text-gray-700">{new Date(payment.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-gray-500">Slot:</span>
                          <span className="text-gray-700">{payment.slot_code}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-gray-500">Amount:</span>
                          <span className="text-[#1E3A8A] font-semibold">PKR {Number(payment.amount || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-gray-500">Status:</span>
                          <span className={`px-3 py-1 rounded-lg ${
                            payment.status === 'Paid'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`} style={{ fontWeight: 600 }}>{payment.status}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <h2 className="text-[#1E3A8A]" style={{ fontSize: '1.875rem', fontWeight: 600 }}>
              My Profile
            </h2>
            <Card className="bg-white shadow-md border-0 rounded-xl">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <p className="text-[#1E3A8A]" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                        {profileData?.full_name || 'Loading...'}
                      </p>
                      <p className="text-gray-600">{profileData?.email || 'Loading...'}</p>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <div>
                      <Label className="text-[#1E3A8A]">Phone Number</Label>
                      <Input className="mt-2" value={profileData?.phone || 'Loading...'} readOnly />
                    </div>
                    <div>
                      <Label className="text-[#1E3A8A]">CNIC</Label>
                      <Input className="mt-2" value={profileData?.cnic || 'Loading...'} readOnly />
                    </div>
                    <div>
                      <Label className="text-[#1E3A8A]">Address</Label>
                      <Input className="mt-2" value={profileData?.address || 'Loading...'} readOnly />
                    </div>
                    <div>
                      <Label className="text-[#1E3A8A]">Member Since</Label>
                      <Input 
                        className="mt-2" 
                        value={profileData?.created_at ? new Date(profileData.created_at).toLocaleDateString() : 'Loading...'} 
                        readOnly 
                      />
                    </div>
                  </div>
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
              <span className="text-[#1E3A8A]" style={{ fontSize: '1.25rem', fontWeight: 600 }}>ParkEasy</span>
            </div>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-[#2563EB] text-white"
                    : "text-gray-700 hover:bg-[#F3F4F6]"
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span style={{ fontWeight: activeTab === "dashboard" ? 600 : 400 }}>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "bookings"
                    ? "bg-[#2563EB] text-white"
                    : "text-gray-700 hover:bg-[#F3F4F6]"
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span style={{ fontWeight: activeTab === "bookings" ? 600 : 400 }}>Bookings</span>
              </button>
              <button
                onClick={() => setActiveTab("payments")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "payments"
                    ? "bg-[#2563EB] text-white"
                    : "text-gray-700 hover:bg-[#F3F4F6]"
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span style={{ fontWeight: activeTab === "payments" ? 600 : 400 }}>Payments</span>
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "profile"
                    ? "bg-[#2563EB] text-white"
                    : "text-gray-700 hover:bg-[#F3F4F6]"
                }`}
              >
                <User className="w-5 h-5" />
                <span style={{ fontWeight: activeTab === "profile" ? 600 : 400 }}>Profile</span>
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

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1E3A8A]">Book Parking Slot</DialogTitle>
            <DialogDescription>
              Complete the details to book your parking slot
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="location-booking">Location</Label>
              <Input
                id="location-booking"
                value={currentLocation.name}
                readOnly
                className="bg-gray-50"
              />
              <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>{currentLocation.address}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slot">Slot Number</Label>
              <Input
                id="slot"
                value={selectedSlotObj ? (selectedSlotObj.slot_code || `${selectedSlotObj.zone}-${String(selectedSlotObj.id).padStart(2, '0')}`) : ""}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle Number</Label>
              <Input
                id="vehicle"
                placeholder="ABC-1234"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="24"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="p-4 bg-[#F3F4F6] rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Rate per hour:</span>
                  <span>PKR {currentLocation.rate}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Duration:</span>
                  <span>{duration} hours</span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="text-gray-700" style={{ fontWeight: 600 }}>Total Amount:</span>
                  <span className="text-[#1E3A8A]" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                    PKR {(parseFloat(duration) * currentLocation.rate).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBooking}
              className="bg-[#2563EB] hover:bg-[#1E3A8A]"
              disabled={!vehicleNumber}
            >
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
