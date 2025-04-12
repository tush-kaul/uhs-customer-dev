"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getCurrentUser } from "@/utils/user";
import { useUserQuery } from "@/lib/tanstack/queries";

export default function Profile() {
  const { data: user, isLoading: loading } = useUserQuery(true, null, null);

  return (
    <div className='flex h-screen bg-gray-50'>
      <div className='flex-1 overflow-auto'>
        <div className='max-w-full lg:max-w-7xl p-4 md:p-6 pl-4 '>
          <div className='mb-6'>
            <h1 className='text-2xl font-bold'>My Profile</h1>
            <p className='text-gray-500'>
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs defaultValue='personal' className='space-y-6'>
            <TabsList className='flex w-full justify-start max-w-2xl gap-4 overflow-x-auto'></TabsList>

            <TabsContent value='personal' className='space-y-6'>
              <div className='bg-white rounded-lg shadow p-6'>
                <div className='flex flex-col md:flex-row gap-8 items-start'>
                  <div className='flex flex-col items-center gap-4'>
                    <div className='relative'>
                      <div className='w-32 h-32 rounded-full overflow-hidden bg-gray-200'>
                        {loading ? (
                          <div className='w-full h-full animate-pulse bg-gray-300'></div>
                        ) : (
                          <Image
                            src={user?.profileImage || "/icons/profile.svg"}
                            alt='Profile Picture'
                            width={128}
                            height={128}
                            className='object-cover'
                          />
                        )}
                      </div>
                      <Button className='absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-4 w-4'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'>
                          <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'></path>
                          <polyline points='17 8 12 3 7 8'></polyline>
                          <line x1='12' y1='3' x2='12' y2='15'></line>
                        </svg>
                        <span className='sr-only'>Upload new picture</span>
                      </Button>
                    </div>
                    <Button variant='outline' size='sm'>
                      Remove Photo
                    </Button>
                  </div>

                  <div className='flex-1 grid gap-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='first-name'>Name</Label>
                        {loading ? (
                          <div className='h-10 animate-pulse bg-gray-300 rounded'></div>
                        ) : (
                          <Input
                            id='first-name'
                            defaultValue={user?.name || ""}
                          />
                        )}
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email Address</Label>
                      {loading ? (
                        <div className='h-10 animate-pulse bg-gray-300 rounded'></div>
                      ) : (
                        <Input
                          id='email'
                          type='email'
                          defaultValue={user?.email || ""}
                        />
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='phone'>Phone Number</Label>
                      {loading ? (
                        <div className='h-10 animate-pulse bg-gray-300 rounded'></div>
                      ) : (
                        <Input
                          id='phone'
                          type='tel'
                          defaultValue={user?.phone || ""}
                        />
                      )}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='city'>Property</Label>
                        {loading ? (
                          <div className='h-10 animate-pulse bg-gray-300 rounded'></div>
                        ) : (
                          <Input
                            id='city'
                            defaultValue={user?.property.name || ""}
                          />
                        )}
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='state'>District</Label>
                        {loading ? (
                          <div className='h-10 animate-pulse bg-gray-300 rounded'></div>
                        ) : (
                          <Input
                            id='state'
                            defaultValue={user?.district.name || ""}
                          />
                        )}
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='zip'>Area</Label>
                        {loading ? (
                          <div className='h-10 animate-pulse bg-gray-300 rounded'></div>
                        ) : (
                          <Input
                            id='zip'
                            defaultValue={user?.area.name || ""}
                          />
                        )}
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='address'>Address</Label>
                      {loading ? (
                        <div className='h-10 animate-pulse bg-gray-300 rounded'></div>
                      ) : (
                        <Input
                          id='address'
                          defaultValue={
                            user?.apartment_number +
                              ", " +
                              user?.residence_type.type || ""
                          }
                        />
                      )}
                    </div>

                    <Button className='w-full md:w-auto justify-self-end mt-4 bg-[#e67e22] hover:bg-[#d35400] text-white'>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
