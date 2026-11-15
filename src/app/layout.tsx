import type {Metadata} from 'next';
import '@fontsource-variable/inter';
import './globals.css';
export const metadata:Metadata={title:{default:'NextGen Laptops Abbottabad | Your Future Tech Partner',template:'%s | NextGen Laptops'},description:'Explore laptops at NextGen Laptops in Abbottabad. Browse Dell, HP and Lenovo, or talk to the shop on WhatsApp.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" id="top"><body>{children}</body></html>}
