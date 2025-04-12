"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home,
  Package,
  MessageSquare,
  User,
  HelpCircle,
  FileText,
  Shield,
  XCircle,
  LogOut,
} from "lucide-react";
import LogoSection from "./LogoSection";
import { useUserData } from "@/hooks/user-provider";
import { Button } from "./ui/button";
import LogoutAction from "@/actions/logout";

export function AppSidebar() {
  const currPath = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();
  const router = useRouter();

  // Helper function to determine active link styles
  const linkClasses = (path: string) => {
    return currPath === path
      ? "flex cursor-pointer items-center gap-3 px-4 py-3 bg-[#25388c] text-white font-bold text-[16px] hover:bg-[#25388c]! hover:text-white!"
      : "flex cursor-pointer items-center gap-3 px-4 py-3 text-gray-500 hover:bg-[#3a354e]/20";
  };

  // Handler for closing sidebar when a link is clicked
  const handleLinkClick = (path: string) => {
    // if (dataLoading) return;

    if (isMobile) {
      setOpenMobile(false);
    }
    router.push(path);
  };

  return (
    <Sidebar>
      <SidebarContent>
        {/* Close Button for mobile or small screens */}
        <div className='flex justify-end p-2 md:hidden'>
          <button
            onClick={() => {
              if (isMobile) {
                setOpenMobile(false);
              }
            }}
            aria-label='Close sidebar'>
            <XCircle className='w-6 h-6 text-gray-500 hover:text-gray-700' />
          </button>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className='flex md:block'>
            <LogoSection />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className='flex-1 flex flex-col py-4 border-t border-[#3a354e]/10'>
              {/* Group 1 */}
              <div className='border-b border-dashed border-[#3a354e]/30 pb-4'>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild={true}>
                      <div
                        onClick={() => handleLinkClick("/dashboard/home")}
                        className={linkClasses("/dashboard/home")}>
                        <Home className='w-5 h-5' />
                        <span>Home</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild={true}>
                      <div
                        onClick={() => handleLinkClick("/dashboard/bookings")}
                        className={linkClasses("/dashboard/bookings")}>
                        <svg
                          width='20'
                          height='20'
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                          className={
                            currPath === "/bookings"
                              ? "text-white"
                              : "text-gray-500"
                          }>
                          <path
                            d='M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        <span>All Bookings</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild={true}>
                      <div
                        onClick={() => handleLinkClick("/dashboard/packages")}
                        className={linkClasses("/dashboard/packages")}>
                        <Package className='w-5 h-5' />
                        <span>All Packages</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild={true}>
                      <div
                        onClick={() =>
                          handleLinkClick("/dashboard/support_requests")
                        }
                        className={linkClasses("/dashboard/support_requests")}>
                        <MessageSquare className='w-5 h-5' />
                        <span>Support Requests</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>

              {/* Group 2 */}
              <div className='py-4 border-b border-dashed border-[#3a354e]/30'>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild={true}>
                      <div
                        onClick={() => handleLinkClick("/dashboard/profile")}
                        className={linkClasses("/dashboard/profile")}>
                        <User className='w-5 h-5' />
                        <span>My Profile</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild={true}>
                      <div
                        onClick={() => handleLinkClick("/dashboard/faqs")}
                        className={linkClasses("/dashboard/faqs")}>
                        <HelpCircle className='w-5 h-5' />
                        <span>FAQs</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>

              {/* Group 3 */}
              <div className='py-4'>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild={true}>
                      <div
                        onClick={() => handleLinkClick("/dashboard/incl-excl")}
                        className={linkClasses("/dashboard/incl-excl")}>
                        <FileText className='w-5 h-5' />
                        <span>Inclusions / Exclusions</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild={true}>
                      <div
                        onClick={() => handleLinkClick("/dashboard/tnc")}
                        className={linkClasses("/dashboard/tnc")}>
                        <FileText className='w-5 h-5' />
                        <span>Terms and Conditions</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild={true}>
                      <div
                        onClick={() => handleLinkClick("/dashboard/privacy")}
                        className={linkClasses("/dashboard/privacy")}>
                        <Shield className='w-5 h-5' />
                        <span>Privacy</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          onClick={async () => {
            await LogoutAction();
            window.location.reload();
          }}>
          <LogOut /> Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
