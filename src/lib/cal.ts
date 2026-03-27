// src/lib/cal.ts

interface CreateBookingParams {
  name: string
  email: string
  phone?: string
  eventTypeId: number
  start: string // ISO 8601 datetime
  timeZone?: string
  notes?: string
}

interface CalBooking {
  id: number
  uid: string
  title: string
  startTime: string
  endTime: string
  attendees: Array<{
    email: string
    name: string
  }>
}

/**
 * Cal.com API v1 Integration
 * Note: Requires CAL_API_KEY and CAL_EVENT_TYPE_ID in environment variables.
 */
export async function createCalBooking(
  params: CreateBookingParams
): Promise<{ success: boolean; booking?: CalBooking; error?: string }> {
  try {
    const response = await fetch('https://api.cal.com/v1/bookings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventTypeId: params.eventTypeId,
        start: params.start,
        responses: {
          name: params.name,
          email: params.email,
          phone: params.phone || '',
          notes: params.notes || '',
        },
        timeZone: params.timeZone || 'America/New_York',
        language: 'en',
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Cal.com API error' }
    }

    const booking: CalBooking = await response.json()
    return { success: true, booking }
  } catch (error) {
    console.error('Cal.com booking error:', error)
    return { success: false, error: 'Failed to create booking' }
  }
}

/**
 * Fetches availability for a specific event type.
 */
export async function getCalAvailability(eventTypeId: number, dateFrom: string, dateTo: string) {
  try {
    const response = await fetch(
      `https://api.cal.com/v1/availability?eventTypeId=${eventTypeId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.CAL_API_KEY}`,
        },
      }
    )

    if (!response.ok) throw new Error('Failed to fetch availability')
    return await response.json()
  } catch (error) {
    console.error('Cal.com availability error:', error)
    return null
  }
}

/**
 * Generates a clean, branded booking link for a user.
 */
export function generateCalLink(username: string, eventSlug: string): string {
  return `https://cal.com/${username}/${eventSlug}`
}
