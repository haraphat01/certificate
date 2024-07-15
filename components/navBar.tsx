// // components/NavBar.js
// import React from "react";
// import Image from 'next/image';
// import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";


// export default function NavBars() {
//     return (
//         <Navbar className="mt-5" position="static">
//             <NavbarBrand>
//                 <Link href="/#" aria-current="page">

//                     <p className="font-bold text-inherit">Bito</p>
//                 </Link>
//             </NavbarBrand>
//             <NavbarContent className="hidden sm:flex gap-4" justify="center">

//                 <NavbarItem isActive>
//                     <Link href="/upload" aria-current="page">
//                         Upload
//                     </Link>
//                 </NavbarItem>
//                 <NavbarItem>
//                     <Button as={Link} color="primary" href="/" variant="flat">
//                         Search
//                     </Button>
//                 </NavbarItem>
//             </NavbarContent>

//         </Navbar>
//     );
// }

"use client"
import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
 import Link from "next/link";
 import { PropsWithChildren } from "react";


 function NavList(props: PropsWithChildren<{}>) {
  return (
    <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
    
    <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
        {...props} // Spread remaining props
        placeholder="" // Add missing properties
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        <Link href="/upload" aria-current="page" className="flex items-center hover:text-blue-500 transition-colors">
          Upload
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
        {...props} // Spread remaining props
        placeholder="" // Add missing properties
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        <Link href="/certificates" aria-current="page" className="flex items-center hover:text-blue-500 transition-colors">
          Search
        </Link>
      </Typography>
    </ul>
  );
}
 
export default function NavBars() {
  const [openNav, setOpenNav] = React.useState(false);
 
  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);
 
  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
 
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
 
  return (
    <Navbar
    className="mx-auto max-w-screen-xl px-6 py-3"
    placeholder=""
    onPointerEnterCapture={() => {}}
    onPointerLeaveCapture={() => {}}
  >
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="/"
          variant="h6"
          className="mr-4 cursor-pointer py-1.5"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Univa
        </Typography>
        <div className="lg:block">
          <NavList />
        </div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
     
    </Navbar>
  );
}