// components/NavBar.js
import React from "react";
import Image from 'next/image';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";


export default function NavBars() {
    return (
        <Navbar className="mt-5" position="static">
            <NavbarBrand>
                <Link href="/#" aria-current="page">
                  
                    <p className="font-bold text-inherit">Bito</p>
                </Link>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                
                <NavbarItem isActive>
                    <Link href="/upload" aria-current="page">
                        Upload
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} color="primary" href="/" variant="flat">
                        L
                    </Button>
                </NavbarItem>
            </NavbarContent>

        </Navbar>
    );
}