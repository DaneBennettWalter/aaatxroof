import Link from "next/link";
import { Container } from "./container";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <Container size="wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">AAA Texas Roofing</h3>
            <p className="text-sm mb-4">
              Central Texas&apos; most trusted roofing company. Professional, reliable, and committed to quality.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(555) 555-5555</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@aaatxroof.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Central Texas</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services/residential" className="hover:text-white transition-colors">Residential Roofing</Link></li>
              <li><Link href="/services/commercial" className="hover:text-white transition-colors">Commercial Roofing</Link></li>
              <li><Link href="/services/storm-damage" className="hover:text-white transition-colors">Storm Damage Repair</Link></li>
              <li><Link href="/services/inspections" className="hover:text-white transition-colors">Roof Inspections</Link></li>
              <li><Link href="/services/insurance-claims" className="hover:text-white transition-colors">Insurance Claims</Link></li>
              <li><Link href="/services/maintenance" className="hover:text-white transition-colors">Maintenance &amp; Repairs</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/projects" className="hover:text-white transition-colors">Our Projects</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Service Area */}
          <div>
            <h3 className="text-white font-semibold mb-4">Service Area</h3>
            <p className="text-sm mb-4">
              We proudly serve Central Texas, including:
            </p>
            <ul className="space-y-1 text-sm">
              <li>Austin</li>
              <li>San Antonio</li>
              <li>Round Rock</li>
              <li>Georgetown</li>
              <li>New Braunfels</li>
              <li>San Marcos</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 py-6 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} AAA Texas Roofing. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
