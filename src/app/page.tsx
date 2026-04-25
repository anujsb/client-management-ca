'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MessageSquare, BarChart3, Zap, ArrowRight, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white via-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <span className="font-bold text-white text-sm">CA</span>
            </div>
            <span className="text-xl font-bold text-slate-900">DocFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-700 hover:text-blue-600">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Document Collection,{' '}
            <span className="bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Automated
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-600">
            Send automated WhatsApp requests to clients, track submissions in real-time, and manage your audit workflow with unprecedented efficiency.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row items-center justify-center sm:gap-6">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-gray-300">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Powerful Features for Modern CAs</h2>
          <p className="mt-4 text-lg text-slate-600">Everything you need to streamline document collection and client management</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Automated WhatsApp Requests</h3>
            <p className="mt-2 text-slate-600">Send personalized document requests directly to clients via WhatsApp. No manual follow-ups needed.</p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Real-Time Tracking</h3>
            <p className="mt-2 text-slate-600">Monitor document submissions with live dashboards. Know exactly what's pending and what's been delivered.</p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Smart Templates</h3>
            <p className="mt-2 text-slate-600">Create reusable document request templates for common audit scenarios. Save time on repetitive tasks.</p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Client Management</h3>
            <p className="mt-2 text-slate-600">Organize all your clients in one place with detailed contact information and communication history.</p>
          </div>

          {/* Feature 5 */}
          <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Compliance Ready</h3>
            <p className="mt-2 text-slate-600">Built with audit requirements in mind. Complete documentation and submission trails for compliance.</p>
          </div>

          {/* Feature 6 */}
          <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Instant Notifications</h3>
            <p className="mt-2 text-slate-600">Get notified immediately when clients submit documents or respond to your requests.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">How It Works</h2>
        </div>

        <div className="space-y-8">
          {/* Step 1 */}
          <div className="flex gap-8 items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold shrink-0">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Add Your Clients</h3>
              <p className="mt-2 text-slate-600">Import or manually add your clients with their contact details and document requirements.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-8 items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold shrink-0">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Create Document Requests</h3>
              <p className="mt-2 text-slate-600">Define which documents you need from each client. Use templates for faster setup.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-8 items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Send Automated Requests</h3>
              <p className="mt-2 text-slate-600">Send personalized WhatsApp messages to all clients at once or individually. Track delivery instantly.</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-8 items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold shrink-0">
              4
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Monitor & Follow Up</h3>
              <p className="mt-2 text-slate-600">Watch submissions come in real-time. Automatic reminders ensure timely compliance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-linear-to-r from-blue-600 to-blue-500 px-8 py-16 text-center sm:px-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to Transform Your Workflow?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Join hundreds of CAs who are saving hours every week with DocFlow.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="mt-8">
              Start Your Free Trial Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="font-bold text-white text-sm">CA</span>
              </div>
              <span className="text-sm font-medium text-slate-900">DocFlow</span>
            </div>
            <p className="text-sm text-slate-600">© 2024 DocFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
