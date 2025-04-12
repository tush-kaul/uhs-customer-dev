"use client";
import Link from "next/link";
import {
  ArrowUpDown,
  MessageCircle,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  Calendar,
  Tag,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CreateTicketAction, TicketsAction } from "@/actions/ticket";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

interface Ticket {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface TicketFormData {
  subject: string;
  description: string;
}

export default function SupportRequests() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTicket, setNewTicket] = useState<TicketFormData>({
    subject: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Added for ticket details sidebar
  const [isDetailsSidebarOpen, setIsDetailsSidebarOpen] =
    useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Function to get tickets with pagination
  const fetchTickets = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await TicketsAction(pageNum, 10);
      if (response && response.data) {
        setTickets(response.data.tickets || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setTickets([]);
        setError("Failed to load tickets");
      }
    } catch (error) {
      setError("An error occurred while fetching tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle creating a new ticket
  const handleCreateTicket = async () => {
    setIsSubmitting(true);

    try {
      // Validate form
      if (!newTicket.subject.trim() || !newTicket.description.trim()) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }
      const response = await CreateTicketAction(
        newTicket.subject,
        newTicket.description
      );

      if (response.status === "error") {
        throw new Error(response.message || "Failed to create ticket");
      }

      toast.success("Support ticket created successfully");

      // Close modal and reset form
      setIsModalOpen(false);
      setNewTicket({ subject: "", description: "" });

      // Refresh tickets
      fetchTickets(1);
    } catch (error: any) {
      toast.error(
        error.message || "Failed to create support ticket. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle pagination change
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      fetchTickets(newPage);
    }
  };

  // Function to handle view details click
  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailsSidebarOpen(true);
  };

  // Get status badge style based on status
  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { bg: string; text: string; label: string }
    > = {
      pending: { bg: "bg-blue-100", text: "text-blue-800", label: "New" },
      in_progress: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "In Progress",
      },
      resolved: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Resolved",
      },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
      closed: { bg: "bg-gray-100", text: "text-gray-800", label: "Closed" },
    };

    const defaultStyle = {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: status,
    };
    const style = statusMap[status?.toLowerCase()] || defaultStyle;

    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString || "N/A";
    }
  };

  // Format time for display
  const formatTime = (dateString: string): string => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (error) {
      return "";
    }
  };

  useEffect(() => {
    fetchTickets(page);
  }, []);

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      {/* Main Content */}
      <div className='flex-1 overflow-auto p-4 md:p-6'>
        <div className='max-w-full mx-auto'>
          <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4'>
            <div>
              <h1 className='text-2xl font-bold'>Support Requests</h1>
              <p className='text-gray-500'>
                View and manage your support tickets
              </p>
            </div>
          </div>

          {/* Create New Ticket Button */}
          <Button
            className='w-full mb-8 bg-[#e67e22] hover:bg-[#d35400] text-white'
            onClick={() => setIsModalOpen(true)}>
            <MessageCircle className='h-5 w-5 mr-2' />
            Create New Support Ticket
          </Button>

          {/* Support Tickets */}
          <div className='mb-8'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold'>Your Support Tickets</h2>
              <div className='flex items-center gap-2'>
                <span className='text-sm'>Latest First</span>
                <ArrowUpDown className='h-4 w-4' />
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className='flex justify-center items-center py-12 bg-white rounded-lg shadow'>
                <Loader2 className='h-8 w-8 text-[#e67e22] animate-spin' />
                <span className='ml-2 text-gray-600'>Loading tickets...</span>
              </div>
            ) : error || tickets.length === 0 ? (
              // Empty/Error State
              <div className='bg-white rounded-lg shadow p-8 text-center'>
                <AlertCircle className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  No tickets found
                </h3>
                <p className='text-gray-500 mb-6'>
                  {error ||
                    "You don't have any support tickets yet. Create one to get started."}
                </p>
                <Button
                  className='bg-[#e67e22] hover:bg-[#d35400] text-white'
                  onClick={() => setIsModalOpen(true)}>
                  <MessageCircle className='h-5 w-5 mr-2' />
                  Create Your First Ticket
                </Button>
              </div>
            ) : (
              // Tickets Table
              <div className='bg-white rounded-lg shadow overflow-hidden'>
                {/* Desktop Table View */}
                <div className='hidden md:block'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Ticket ID
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Subject
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Date Created
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Status
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Last Updated
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {tickets.map((ticket) => (
                        <tr key={ticket.id}>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='text-sm font-medium'>
                              #{ticket.ticket_number}
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='text-sm'>{ticket.subject}</div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='text-sm'>
                              {formatDate(ticket.createdAt)}
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            {getStatusBadge(ticket.status)}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='text-sm'>
                              {formatDate(ticket.updatedAt)}
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                            <button
                              onClick={() => handleViewDetails(ticket)}
                              className='text-blue-500 hover:text-blue-700'>
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className='md:hidden divide-y divide-gray-200'>
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className='p-4 space-y-3'>
                      <div className='flex justify-between items-start'>
                        <div className='text-sm font-medium'>
                          #{ticket.ticket_number}
                        </div>
                        {getStatusBadge(ticket.status)}
                      </div>
                      <div className='text-sm font-medium'>
                        {ticket.subject}
                      </div>
                      <div className='flex justify-between text-xs text-gray-500'>
                        <div>Created: {formatDate(ticket.createdAt)}</div>
                        <div>Updated: {formatDate(ticket.updatedAt)}</div>
                      </div>
                      <button
                        onClick={() => handleViewDetails(ticket)}
                        className='block w-full text-center py-2 px-4 bg-gray-100 rounded-md text-blue-500 hover:text-blue-700 text-sm font-medium'>
                        View Details
                      </button>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className='px-4 py-3 flex items-center justify-center md:justify-between bg-gray-50 border-t border-gray-200 sm:px-6'>
                    <div className='hidden md:block'>
                      <p className='text-sm text-gray-700'>
                        Showing page <span className='font-medium'>{page}</span>{" "}
                        of <span className='font-medium'>{totalPages}</span>{" "}
                        pages
                      </p>
                    </div>
                    <div className='flex justify-between w-full md:w-auto'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className='mr-2'>
                        <ChevronLeft className='h-4 w-4 mr-1' />
                        Previous
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}>
                        Next
                        <ChevronRight className='h-4 w-4 ml-1' />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FAQ Section */}
          <div className='mb-8'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold'>Frequently Asked Questions</h2>
              <Link href='/faqs' className='text-blue-500 hover:underline'>
                View all FAQs
              </Link>
            </div>

            <div className='bg-white rounded-lg shadow p-6 space-y-4'>
              <div className='border-b pb-4'>
                <h3 className='font-medium mb-2'>
                  How do I reschedule a service?
                </h3>
                <p className='text-gray-600 text-sm'>
                  You can reschedule a service up to 24 hours before the
                  scheduled time. Go to your bookings, select the service, and
                  click on the reschedule option.
                </p>
              </div>

              <div className='border-b pb-4'>
                <h3 className='font-medium mb-2'>
                  {"What's included in the deep cleaning service?"}
                </h3>
                <p className='text-gray-600 text-sm'>
                  Deep cleaning includes all regular cleaning services plus
                  detailed cleaning of kitchen appliances, bathroom fixtures,
                  window sills, and baseboards.
                </p>
              </div>

              <div>
                <h3 className='font-medium mb-2'>How do I cancel a service?</h3>
                <p className='text-gray-600 text-sm'>
                  You can cancel a service up to 48 hours before the scheduled
                  time without any cancellation fee. Go to your bookings, select
                  the service, and click on the cancel option.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div>
            <div className='mb-4'>
              <h2 className='text-xl font-bold'>Contact Support Directly</h2>
            </div>

            <div className='bg-white rounded-lg shadow p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='flex items-center gap-4'>
                  <div className='bg-blue-100 p-3 rounded-full'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-blue-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className='font-medium'>Phone Support</h3>
                    <p className='text-gray-600 text-sm'>+1 (800) 123-4567</p>
                    <p className='text-gray-500 text-xs'>Mon-Fri, 9am-6pm</p>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='bg-green-100 p-3 rounded-full'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-green-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className='font-medium'>Email Support</h3>
                    <p className='text-gray-600 text-sm'>
                      support@urbanservices.com
                    </p>
                    <p className='text-gray-500 text-xs'>24/7 Support</p>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='bg-purple-100 p-3 rounded-full'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-purple-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className='font-medium'>Live Chat</h3>
                    <p className='text-gray-600 text-sm'>
                      Chat with our support team
                    </p>
                    <p className='text-gray-500 text-xs'>Available 24/7</p>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='bg-red-100 p-3 rounded-full'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-red-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z'
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className='font-medium'>Social Media</h3>
                    <p className='text-gray-600 text-sm'>
                      Message us on social media
                    </p>
                    <p className='text-gray-500 text-xs'>
                      Response within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle className='text-xl font-semibold'>
              Create Support Ticket
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-2'>
            <label htmlFor='subject' className='text-sm font-medium'>
              Subject <span className='text-red-500'>*</span>
            </label>
            <Input
              id='subject'
              value={newTicket.subject}
              onChange={(e) =>
                setNewTicket({ ...newTicket, subject: e.target.value })
              }
              placeholder='Brief description of your issue'
              required
            />
          </div>

          <div className='space-y-2'>
            <label htmlFor='description' className='text-sm font-medium'>
              Description <span className='text-red-500'>*</span>
            </label>
            <Textarea
              id='description'
              value={newTicket.description}
              onChange={(e) =>
                setNewTicket({ ...newTicket, description: e.target.value })
              }
              placeholder='Please provide details about your issue'
              rows={5}
              required
            />
          </div>

          <DialogFooter className='mt-6'>
            <DialogClose asChild>
              <Button variant='outline' type='button' disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type='button'
              onClick={handleCreateTicket}
              className='bg-[#e67e22] hover:bg-[#d35400] text-white'
              disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Submitting...
                </>
              ) : (
                "Submit Ticket"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ticket Details Sidebar */}
      <Sheet open={isDetailsSidebarOpen} onOpenChange={setIsDetailsSidebarOpen}>
        <SheetContent className='w-full sm:max-w-md overflow-auto '>
          <SheetHeader className='mb-5'>
            <SheetTitle className='text-xl'>Ticket Details</SheetTitle>
          </SheetHeader>

          {selectedTicket && (
            <div className='space-y-6 p-4'>
              {/* Ticket header with ID and status */}
              <div className='flex items-start justify-between'>
                <div className='flex items-center space-x-2'>
                  <Tag className='h-4 w-4 text-gray-500' />
                  <h3 className='text-sm font-medium text-gray-700'>
                    #{selectedTicket.ticket_number}
                  </h3>
                </div>
                <div>{getStatusBadge(selectedTicket.status)}</div>
              </div>

              {/* Ticket subject */}
              <div>
                <h2 className='text-xl font-semibold mb-1'>
                  {selectedTicket.subject}
                </h2>
              </div>

              {/* Creation and update info */}
              <div className='space-y-2'>
                <div className='flex items-center text-sm text-gray-500'>
                  <Calendar className='h-4 w-4 mr-2' />
                  <span>
                    Created: {formatDate(selectedTicket.createdAt)} at{" "}
                    {formatTime(selectedTicket.createdAt)}
                  </span>
                </div>
                <div className='flex items-center text-sm text-gray-500'>
                  <Clock className='h-4 w-4 mr-2' />
                  <span>
                    Last updated: {formatDate(selectedTicket.updatedAt)} at{" "}
                    {formatTime(selectedTicket.updatedAt)}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className='border-t border-gray-200'></div>

              {/* Description section */}
              <div>
                <h3 className='text-sm font-medium text-gray-700 mb-2 flex items-center'>
                  <Info className='h-4 w-4 mr-2' />
                  Description
                </h3>
                <div className='bg-gray-50 p-4 rounded-md text-sm whitespace-pre-wrap'>
                  {selectedTicket.description}
                </div>
              </div>

              {/* Divider */}
              <div className='border-t border-gray-200'></div>

              {/* Action buttons */}
              {/* <div className='flex space-x-3 justify-end'>
                <SheetClose asChild>
                  <Button variant='outline'>Close</Button>
                </SheetClose>
                {selectedTicket.status !== "resolved" &&
                  selectedTicket.status !== "closed" && (
                    <Button className='bg-[#e67e22] hover:bg-[#d35400] text-white'>
                      Reply to Ticket
                    </Button>
                  )}
              </div> */}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
