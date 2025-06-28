'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MeasurementApiService from '@/services/api';
import { Measurement } from '@/types/measurement';

export default function MeasurementsPage() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      const data = await MeasurementApiService.getMeasurements();
      setMeasurements(data);
    } catch (err) {
      setError('Failed to fetch measurements');
      console.error('Error fetching measurements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this measurement?')) {
      return;
    }

    try {
      await MeasurementApiService.deleteMeasurement(id);
      setMeasurements(measurements.filter(m => m.id !== id));
    } catch (err) {
      setError('Failed to delete measurement');
      console.error('Error deleting measurement:', err);
    }
  };

  const getGarmentTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'shalwar_qameez': 'Shalwar Qameez',
      'shirt': 'Shirt',
      'coat': 'Coat',
      'waistcoat': 'Waistcoat',
    };
    return labels[type] || type;
  };

  const getCustomerName = (title: string) => {
    // Extract customer name from title (assuming format like "Customer Name - Garment Type")
    return title.split(' - ')[0] || title;
  };

  const getKeyMeasurements = (measurement: Measurement) => {
    const measurements = measurement.measurements;
    const keyMeasurements: string[] = [];

    // Show relevant measurements based on type
    if (measurements.qameez_chest) keyMeasurements.push(`Chest: ${measurements.qameez_chest}"`);
    if (measurements.shirt_chest) keyMeasurements.push(`Chest: ${measurements.shirt_chest}"`);
    if (measurements.coat_chest) keyMeasurements.push(`Chest: ${measurements.coat_chest}"`);
    if (measurements.waistcoat_chest) keyMeasurements.push(`Chest: ${measurements.waistcoat_chest}"`);
    
    if (measurements.qameez_length) keyMeasurements.push(`Length: ${measurements.qameez_length}"`);
    if (measurements.shirt_length) keyMeasurements.push(`Length: ${measurements.shirt_length}"`);
    if (measurements.coat_length) keyMeasurements.push(`Length: ${measurements.coat_length}"`);
    if (measurements.waistcoat_length) keyMeasurements.push(`Length: ${measurements.waistcoat_length}"`);

    return keyMeasurements;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Measurements</h1>
          <p className="text-gray-600">Manage customer measurements for different garment types</p>
        </div>
        <Link
          href="/dashboard/measurements/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add New Measurement</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Measurements List */}
      <div className="bg-white shadow rounded-lg">
        {measurements.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No measurements</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new measurement.</p>
            <div className="mt-6">
              <Link
                href="/dashboard/measurements/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Measurement
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Garment Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Key Measurements
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {measurements.map((measurement) => {
                  const keyMeasurements = getKeyMeasurements(measurement);
                  return (
                    <tr key={measurement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {getCustomerName(measurement.title)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {measurement.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getGarmentTypeLabel(measurement.measurement_type.name)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="space-y-1">
                          {keyMeasurements.map((measurement, index) => (
                            <div key={index}>{measurement}</div>
                          ))}
                          {keyMeasurements.length === 0 && (
                            <div className="text-gray-400">No measurements recorded</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(measurement.created).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/dashboard/measurements/${measurement.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                          <Link
                            href={`/dashboard/measurements/${measurement.id}/edit`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(measurement.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {measurements.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {measurements.length}
            </div>
            <div className="text-sm text-gray-600">Total Measurements</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {measurements.filter(m => m.measurement_type.name === 'shalwar_qameez').length}
            </div>
            <div className="text-sm text-gray-600">Shalwar Qameez</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">
              {measurements.filter(m => m.measurement_type.name === 'shirt').length}
            </div>
            <div className="text-sm text-gray-600">Shirts</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">
              {measurements.filter(m => m.measurement_type.name === 'coat' || m.measurement_type.name === 'waistcoat').length}
            </div>
            <div className="text-sm text-gray-600">Coats & Waistcoats</div>
          </div>
        </div>
      )}
    </div>
  );
}
