import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { routes } from 'routes';
import { getActiveNavbar, getActiveRoute, isWindowAvailable } from 'utils/navigation';
import Navbar from 'components/navbar';
import Sidebar from 'components/sidebar';
import Footer from 'components/footer/Footer';

export default function Admin({ children }) {
  // states and functions
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  
  if (isWindowAvailable()) document.documentElement.dir = 'ltr';

  return (
    <>
      <div className="flex h-full w-full bg-background-100 scrollbar-hide dark:bg-background-900">
        <Sidebar routes={routes} open={open} setOpen={setOpen} variant="admin" />
        {/* Navbar & Main Content */}
        <div className="font-dm mx-auto h-full w-full dark:bg-navy-900">
          {/* Main Content */}
          <main className="mx-2.5 flex-none transition-all scrollbar-hide dark:bg-navy-900 md:pr-2 xl:ml-[323px]">
            {/* Routes */}
            <div>
              <Navbar
                onOpenSidenav={() => setOpen(!open)}
                brandText={getActiveRoute(routes, pathname)}
                secondary={getActiveNavbar(routes, pathname)}
              />
              <div className="mx-auto min-h-screen p-2 !pt-[10px] scrollbar-hide md:p-2">
                {children}
              </div>
              <div className="p-3">
                <Footer />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
