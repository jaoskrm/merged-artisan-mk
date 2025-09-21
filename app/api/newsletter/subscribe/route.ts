import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletterSubscriptions } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existingSubscription = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, normalizedEmail))
      .limit(1);

    if (existingSubscription.length > 0) {
      const subscription = existingSubscription[0];
      
      if (subscription.isActive) {
        return NextResponse.json(
          { success: false, message: 'This email is already subscribed to our newsletter' },
          { status: 409 }
        );
      } else {
        // Reactivate subscription
        await db
          .update(newsletterSubscriptions)
          .set({
            isActive: true,
            subscribedAt: new Date(),
            unsubscribedAt: null,
          })
          .where(eq(newsletterSubscriptions.email, normalizedEmail));

        return NextResponse.json({
          success: true,
          message: 'Welcome back! Your newsletter subscription has been reactivated.',
        });
      }
    }

    // Create new subscription
    await db.insert(newsletterSubscriptions).values({
      email: normalizedEmail,
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! You\'ll receive updates about new artists and exclusive offers.',
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
