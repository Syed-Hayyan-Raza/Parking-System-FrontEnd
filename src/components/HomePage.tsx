import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Car, Clock, Shield, CheckCircle2, MapPin, CreditCard, Search, Building2 } from "lucide-react";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const parkingLocations = [
  { id: "loc1", name: "Downtown Plaza", address: "123 Main St, Downtown", totalSlots: 50, available: 23, rate: 5 },
  { id: "loc2", name: "City Mall Parking", address: "456 Shopping Ave, Central", totalSlots: 100, available: 45, rate: 6 },
  { id: "loc3", name: "Airport Terminal", address: "789 Airport Rd, North", totalSlots: 200, available: 87, rate: 8 },
  { id: "loc4", name: "Business District", address: "321 Corporate Blvd, East", totalSlots: 75, available: 12, rate: 7 },
];

export function HomePage({ onNavigate }: HomePageProps) {
  const [searchLocation, setSearchLocation] = useState("");

  const filteredLocations = parkingLocations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchLocation.toLowerCase())
  );

  const features = [
    {
      icon: <MapPin className="w-8 h-8 text-[#2563EB]" />,
      title: "Find Parking",
      description: "Locate available parking spots near your destination in real-time",
    },
    {
      icon: <Clock className="w-8 h-8 text-[#2563EB]" />,
      title: "Book in Advance",
      description: "Reserve your parking spot ahead of time and avoid the hassle",
    },
    {
      icon: <CreditCard className="w-8 h-8 text-[#2563EB]" />,
      title: "Easy Payment",
      description: "Secure and convenient payment options with instant confirmation",
    },
    {
      icon: <Shield className="w-8 h-8 text-[#2563EB]" />,
      title: "Safe & Secure",
      description: "24/7 monitored parking facilities with advanced security systems",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Regular User",
      content: "This app has saved me so much time! No more circling around looking for parking spots.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Business Owner",
      content: "The booking system is incredibly easy to use. I never worry about parking anymore.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Daily Commuter",
      content: "Great app! The real-time availability feature is a game-changer for my daily commute.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-[#1E3A8A]" style={{ fontSize: '1.25rem', fontWeight: 600 }}>ParkEasy</span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => onNavigate('login')}
                className="text-[#1E3A8A] hover:text-[#2563EB] hover:bg-[#F3F4F6]"
              >
                Login
              </Button>
              <Button 
                onClick={() => onNavigate('login')}
                className="bg-[#2563EB] hover:bg-[#1E3A8A] text-white"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <h1 className="mb-6" style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.2 }}>
              Smart Parking Made Easy
            </h1>
            <p className="mb-8 opacity-90" style={{ fontSize: '1.125rem' }}>
              Find, book, and pay for parking in seconds. Join thousands of satisfied users who never worry about parking again.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg"
                onClick={() => onNavigate('login')}
                className="bg-white text-[#1E3A8A] hover:bg-gray-100 shadow-lg"
              >
                Book a Slot
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => onNavigate('login')}
                className="border-2 border-white text-white hover:bg-white hover:text-[#1E3A8A] transition-all shadow-lg"
              >
                View Availability
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1673717466125-bd7c684391cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwbG90JTIwYWVyaWFsfGVufDF8fHx8MTc2MTE5ODgyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Parking lot aerial view"
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Location Search Section */}
      <section className="py-12 px-4 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-white shadow-xl border-0 rounded-2xl">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[#1E3A8A] mb-2" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                    Find Parking Near You
                  </h3>
                  <p className="text-gray-600">Search for available parking locations</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search by location name or address..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="pl-12 h-14 rounded-xl border-gray-300 focus:border-[#2563EB] focus:ring-[#2563EB]"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((location) => (
                      <Card key={location.id} className="bg-[#F3F4F6] border-0 rounded-xl hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-5 h-5 text-[#2563EB]" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-[#1E3A8A] mb-1" style={{ fontWeight: 600 }}>
                                  {location.name}
                                </h4>
                                <p className="text-gray-600 mb-3" style={{ fontSize: '0.875rem' }}>
                                  {location.address}
                                </p>
                                <div className="flex flex-wrap gap-3 text-gray-700">
                                  <span className="flex items-center gap-1" style={{ fontSize: '0.875rem' }}>
                                    <MapPin className="w-4 h-4 text-[#2563EB]" />
                                    {location.available}/{location.totalSlots} available
                                  </span>
                                  <span className="flex items-center gap-1" style={{ fontSize: '0.875rem' }}>
                                    <CreditCard className="w-4 h-4 text-[#2563EB]" />
                                    ${location.rate}/hour
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button 
                              onClick={() => onNavigate('login')}
                              size="sm"
                              className="bg-[#2563EB] hover:bg-[#1E3A8A] flex-shrink-0"
                            >
                              Book
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                      No locations found. Try a different search term.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[#1E3A8A] mb-4" style={{ fontSize: '2.5rem', fontWeight: 600 }}>
              How It Works
            </h2>
            <p className="text-gray-600" style={{ fontSize: '1.125rem' }}>
              Get started in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-0 rounded-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white" style={{ fontSize: '1.5rem', fontWeight: 600 }}>1</span>
                </div>
                <h3 className="text-[#1E3A8A] mb-3" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                  Search Location
                </h3>
                <p className="text-gray-600">
                  Enter your destination and view all available parking spots nearby
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-0 rounded-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white" style={{ fontSize: '1.5rem', fontWeight: 600 }}>2</span>
                </div>
                <h3 className="text-[#1E3A8A] mb-3" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                  Book Your Spot
                </h3>
                <p className="text-gray-600">
                  Select your preferred parking spot and choose your duration
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-0 rounded-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white" style={{ fontSize: '1.5rem', fontWeight: 600 }}>3</span>
                </div>
                <h3 className="text-[#1E3A8A] mb-3" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                  Park & Relax
                </h3>
                <p className="text-gray-600">
                  Arrive at your reserved spot and enjoy hassle-free parking
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[#1E3A8A] mb-4" style={{ fontSize: '2.5rem', fontWeight: 600 }}>
              Why Choose ParkEasy?
            </h2>
            <p className="text-gray-600" style={{ fontSize: '1.125rem' }}>
              The smartest way to handle your parking needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#F3F4F6] rounded-xl flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-[#1E3A8A] mb-2" style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[#1E3A8A] mb-4" style={{ fontSize: '2.5rem', fontWeight: 600 }}>
              What Our Users Say
            </h2>
            <p className="text-gray-600" style={{ fontSize: '1.125rem' }}>
              Join thousands of happy parkers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-md border-0 rounded-xl">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <CheckCircle2 key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="text-[#1E3A8A]" style={{ fontWeight: 600 }}>{testimonial.name}</p>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E3A8A] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Car className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>ParkEasy</span>
              </div>
              <p className="text-white/80">Making parking simple, smart, and stress-free.</p>
            </div>
            <div>
              <h4 className="mb-4" style={{ fontWeight: 600 }}>Quick Links</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Services</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4" style={{ fontWeight: 600 }}>Support</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4" style={{ fontWeight: 600 }}>Contact</h4>
              <ul className="space-y-2 text-white/80">
                <li>Email: info@parkeasy.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Parking St, City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-white/80">
            <p>&copy; 2025 ParkEasy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}