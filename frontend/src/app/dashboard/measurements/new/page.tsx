'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MeasurementForm from '@/components/MeasurementForm';
import { MeasurementFormData } from '@/types/measurement';
import MeasurementApiService from '@/services/api';

export default function NewMeasurementPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (data: MeasurementFormData) => {
    setIsSubmitting(true);
    setError('');

    try {
      await MeasurementApiService.createMeasurement(data);
      router.push('/dashboard/measurements');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create measurement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Measurement</h1>
          <p className="text-gray-600">Create a new customer measurement record</p>
        </div>
        <Link
          href="/dashboard/measurements"
          className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Measurements</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <MeasurementForm
          onSubmit={handleSubmit}
          onSuccess={() => router.push('/dashboard/measurements')}
        />
      </div>
    </div>
  );
}
