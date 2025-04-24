"use client";

import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Button,
  Input,
} from "@heroui/react";
import { ThemeSwitch } from "@/components/Theme/theme-switch";
import { 
  Plane, 
  Bus, 
  Umbrella, 
  Star, 
  MapPin, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Award, 
  PlaneTakeoff, 
  Train, 
  Sunset,
  Compass
} from "lucide-react";
import { SkyJetLogo } from "../../atoms/Logo/logo";

export const Navbar = () => {
  return (
    <HeroUINavbar
      maxWidth="xl"
      className="bg-white dark:bg-gray-950 shadow-md border-b border-indigo-100 dark:border-indigo-950 py-3"
    >
      <NavbarBrand className="gap-3">
        <SkyJetLogo/>
        <div className="flex flex-col">
          <p className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-blue-300">SkyJet</p>
          <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 font-medium">Premium Travel Solutions</p>
        </div>
      </NavbarBrand>

      <NavbarContent className="hidden lg:flex gap-8" justify="center">
        <NavbarItem>
          <Link 
            className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors relative group py-2 px-3 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-950/50" 
            href="#flights"
          >
            <PlaneTakeoff size={18} className="group-hover:translate-x-1 transition-transform" />
            <span>Flights</span>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group py-2 px-3 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-950/50" 
            href="#buses"
          >
            <Train size={18} className="group-hover:translate-x-1 transition-transform" />
            <span>Buses & Trains</span>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group py-2 px-3 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-950/50" 
            href="#holidays"
          >
            <Sunset size={18} className="group-hover:translate-x-1 transition-transform" />
            <span>Holiday Packages</span>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group py-2 px-3 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-950/50" 
            href="#umrah"
          >
            <Compass size={18} className="group-hover:translate-x-1 transition-transform" />
            <span>Umrah & Hajj</span>
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="gap-4" justify="end">
        <NavbarItem>
          <ThemeSwitch className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-full p-1" />
        </NavbarItem>
        
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            
              <Avatar
                isBordered
                color="primary"
                name="Alex Morgan"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                className="border-indigo-600 dark:border-indigo-400"
              />
            
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="Profile Actions" 
            variant="flat"
            className="w-64 p-1"
          >
            <DropdownItem key="profile" className="h-16 gap-2 p-3 mb-1 bg-indigo-50/50 dark:bg-indigo-950/50 rounded-lg">
              <p className="font-medium text-sm text-gray-600 dark:text-gray-400">Signed in as</p>
              <p className="font-semibold text-indigo-600 dark:text-indigo-400">alex@skyjet.com</p>
            </DropdownItem>
            <DropdownItem key="trips" startContent={<MapPin size={16} className="text-indigo-500" />} className="py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/50">My Trips</DropdownItem>
            <DropdownItem key="settings" startContent={<Settings size={16} className="text-indigo-500" />} className="py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/50">Account Settings</DropdownItem>
            <DropdownItem key="rewards" startContent={<Award size={16} className="text-indigo-500" />} className="py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/50">Loyalty Rewards</DropdownItem>
            <DropdownItem key="help" startContent={<HelpCircle size={16} className="text-indigo-500" />} className="py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/50">Help Center</DropdownItem>
            <DropdownItem key="logout" startContent={<LogOut size={16} className="text-red-500" />} className="text-red-500 mt-1 border-t border-gray-200 dark:border-gray-800 py-2 hover:bg-red-50 dark:hover:bg-red-950/30">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </HeroUINavbar>
  );
};