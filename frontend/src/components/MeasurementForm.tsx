'use client';

import { useState, useEffect } from 'react';
import { MeasurementApiService } from '@/services/api';
import {
  MeasurementType,
  MeasurementFormData,
  AllMeasurements,
  ShalwarQameezMeasurements,
  ShirtMeasurements,
  CoatMeasurements,
  WaistcoatMeasurements
} from '@/types/measurement';

interface MeasurementFormProps {
  onSubmit?: (data: MeasurementFormData) => void;
  onSuccess?: () => void;
}

// Field configurations for each garment type
const FIELD_CONFIGS = {
  'Shalwar Qameez': {
    qameez: [
      { key: 'qameez_length', label: 'Qameez Length' },
      { key: 'qameez_chest', label: 'Qameez Chest' },
      { key: 'qameez_waist', label: 'Qameez Waist' },
      { key: 'qameez_hip', label: 'Qameez Hip' },
      { key: 'qameez_shoulder', label: 'Qameez Shoulder' },
      { key: 'qameez_sleeve_length', label: 'Qameez Sleeve Length' },
      { key: 'qameez_neck', label: 'Qameez Neck' },
      { key: 'qameez_armhole', label: 'Qameez Armhole' },
    ],
    shalwar: [
      { key: 'shalwar_length', label: 'Shalwar Length' },
      { key: 'shalwar_waist', label: 'Shalwar Waist' },
      { key: 'shalwar_hip', label: 'Shalwar Hip' },
      { key: 'shalwar_thigh', label: 'Shalwar Thigh' },
      { key: 'shalwar_bottom', label: 'Shalwar Bottom' },
      { key: 'shalwar_knee', label: 'Shalwar Knee' },
    ],
  },
  'Shirt': [
    { key: 'shirt_length', label: 'Length' },
    { key: 'shirt_chest', label: 'Chest' },
    { key: 'shirt_waist', label: 'Waist' },
    { key: 'shirt_shoulder', label: 'Shoulder' },
    { key: 'shirt_sleeve_length', label: 'Sleeve Length' },
    { key: 'shirt_neck', label: 'Neck' },
    { key: 'shirt_armhole', label: 'Armhole' },
    { key: 'shirt_cuff', label: 'Cuff' },
  ],
  'Coat': [
    { key: 'coat_length', label: 'Length' },
    { key: 'coat_chest', label: 'Chest' },
    { key: 'coat_waist', label: 'Waist' },
    { key: 'coat_hip', label: 'Hip' },
    { key: 'coat_shoulder', label: 'Shoulder' },
    { key: 'coat_sleeve_length', label: 'Sleeve Length' },
    { key: 'coat_neck', label: 'Neck' },
    { key: 'coat_armhole', label: 'Armhole' },
    { key: 'coat_lapel_width', label: 'Lapel Width' },
  ],
  'Waistcoat': [
    { key: 'waistcoat_length', label: 'Length' },
    { key: 'waistcoat_chest', label: 'Chest' },
    { key: 'waistcoat_waist', label: 'Waist' },
    { key: 'waistcoat_shoulder', label: 'Shoulder' },
    { key: 'waistcoat_armhole', label: 'Armhole' },
    { key: 'waistcoat_neck', label: 'Neck' },
  ],
};

export default function MeasurementForm({ onSubmit, onSuccess }: MeasurementFormProps) {
  const [measurementTypes, setMeasurementTypes] = useState<MeasurementType[]>([]);
  const [selectedType, setSelectedType] = useState<MeasurementType | null>(null);
  const [formData, setFormData] = useState<MeasurementFormData>({
    title: '',
    measurement_type_id: '',
    measurements: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load measurement types on component mount
  useEffect(() => {
    const loadMeasurementTypes = async () => {
      try {
        const types = await MeasurementApiService.getMeasurementTypes();
        setMeasurementTypes(types);
      } catch (err) {
        setError('Failed to load measurement types');
        console.error(err);
      }
    };

    loadMeasurementTypes();
  }, []);

  const handleTypeChange = (typeId: string) => {
    const type = measurementTypes.find(t => t.id === typeId);
    setSelectedType(type || null);
    setFormData(prev => ({
      ...prev,
      measurement_type_id: typeId,
      measurements: {}, // Reset measurements when type changes
    }));
  };

  const handleMeasurementChange = (key: keyof AllMeasurements, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    setFormData(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [key]: numValue,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (onSubmit) {
        onSubmit(formData);
      } else {
        await MeasurementApiService.createMeasurement(formData);
        // Reset form
        setFormData({
          title: '',
          measurement_type_id: '',
          measurements: {},
        });
        setSelectedType(null);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      setError('Failed to save measurement');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderMeasurementFields = () => {
    if (!selectedType) return null;

    const config = FIELD_CONFIGS[selectedType.name as keyof typeof FIELD_CONFIGS];
    if (!config) return null;

    if (selectedType.name === 'Shalwar Qameez') {
      const shalwarConfig = config as typeof FIELD_CONFIGS['Shalwar Qameez'];
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Qameez Measurements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shalwarConfig.qameez.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label} (inches)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.measurements[field.key as keyof AllMeasurements] || ''}
                    onChange={(e) => handleMeasurementChange(field.key as keyof AllMeasurements, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-600">Shalwar Measurements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shalwarConfig.shalwar.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label} (inches)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.measurements[field.key as keyof AllMeasurements] || ''}
                    onChange={(e) => handleMeasurementChange(field.key as keyof AllMeasurements, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      const simpleConfig = config as Array<{ key: string; label: string }>;
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {simpleConfig.map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} (inches)
              </label>
              <input
                type="number"
                step="0.25"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.measurements[field.key as keyof AllMeasurements] || ''}
                onChange={(e) => handleMeasurementChange(field.key as keyof AllMeasurements, e.target.value)}
              />
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Measurement</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name / Title
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter customer name or measurement title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Garment Type
          </label>
          <select
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.measurement_type_id}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="">Select garment type</option>
            {measurementTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {selectedType && (
            <p className="mt-1 text-sm text-gray-600">{selectedType.description}</p>
          )}
        </div>

        {renderMeasurementFields()}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={() => {
              setFormData({ title: '', measurement_type_id: '', measurements: {} });
              setSelectedType(null);
            }}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading || !selectedType}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Measurement'}
          </button>
        </div>
      </form>
    </div>
  );
}
