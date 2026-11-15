import type {Metadata} from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {Phone, MapPin} from 'lucide-react';
import MobileNavigation from '@/components/MobileNavigation';
import {mainNavigation} from '@/lib/navigation';
import FloatingActions from '@/components/FloatingActions';
import ScrollReveal from '@/components/ScrollReveal';
import SocialLinks from '@/components/SocialLinks';
import '@fontsource-variable/inter';
import './globals.css';
export const metadata:Metadata={title:{default:'NextGen Laptops Abbottabad | Your Future Tech Partner',template:'%s | NextGen Laptops'},description:'Explore laptops at NextGen Laptops in Abbottabad. Browse Dell, HP and Lenovo, or talk to the shop on WhatsApp.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" id="top"><body><div className="announcement"><div className="announce-inner"><span>YOUR FUTURE TECH PARTNER <i> / </i> ABBOTTABAD</span><span>Questions? Call <a href="tel:03215744034">0321 5744034</a></span></div></div><header className="header"><Link href="/" className="logo" aria-label="NextGen Laptops home"><Image src="/brand/nextgen-logo.webp" width={190} height={65} alt="NextGen Laptops" priority/></Link><nav className="nav" aria-label="Main navigation">{mainNavigation.filter(item=>item.href!=='/').map(item=><Link href={item.href} key={item.href}>{item.label}</Link>)}</nav><div className="header-right"><a href="tel:03215744034" className="header-call"><Phone size={16}/> <span>Talk to our team</span></a><MobileNavigation/></div></header>{children}<FloatingActions/><ScrollReveal/><footer><div className="footer-top"><div><Link href="/" className="footer-logo" aria-label="NextGen Laptops home"><Image src="/brand/nextgen-logo.webp" width={190} height={65} alt="NextGen Laptops"/></Link><p>Your Future Tech Partner in Abbottabad.</p><SocialLinks/></div><div><strong>EXPLORE</strong><Link href="/shop">All laptops</Link><Link href="/shop?brand=Dell">Dell laptops</Link><Link href="/shop?brand=HP">HP laptops</Link><Link href="/about">About us</Link><Link href="/#visit">Visit us</Link></div><div><strong>CONTACT THE SHOP</strong><a href="tel:03215744034">0321 5744034</a><a href="tel:03141989739">0314 1989739</a><p><MapPin size={14}/> Jadoon Plaza Phase 2, Mandian, Abbottabad<br/>Please confirm before visiting.</p></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} NextGen Laptops</span><span>YOUR FUTURE TECH PARTNER</span></div></footer></body></html>}
