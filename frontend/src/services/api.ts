import axios from 'axios';
import {
  JsonApiResource,
  MeasurementType,
  Measurement,
  MeasurementFormData,
  MeasurementTypesResponse,
  MeasurementsResponse,
  MeasurementResponse,
  AllMeasurements
} from '@/types/measurement';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_DRUPAL_API_URL || 'https://tailor-next-drupal.ddev.site';
const JSON_API_BASE = `${API_BASE_URL}/jsonapi`;

// Create axios instance with default headers
const apiClient = axios.create({
  baseURL: JSON_API_BASE,
  headers: {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await fetch(`${API_BASE_URL}/oauth/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'refresh_token',
              refresh_token: refreshToken,
              client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID || 'default_consumer',
              client_secret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET || 'default_secret',
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('auth_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
            return apiClient(originalRequest);
          }
        }
        
        // If refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to transform JSON:API resource to our types
function transformMeasurementType(resource: JsonApiResource): MeasurementType {
  return {
    id: resource.id,
    name: resource.attributes.name,
    description: resource.attributes.description?.processed || resource.attributes.description?.value || '',
    tid: resource.attributes.drupal_internal__tid,
  };
}

function transformMeasurement(resource: JsonApiResource): Measurement {
  const measurements: AllMeasurements = {};
  
  // Extract all measurement fields from attributes
  Object.keys(resource.attributes).forEach(key => {
    if (key.startsWith('field_')) {
      const fieldName = key.replace('field_', '');
      if (resource.attributes[key] !== null) {
        measurements[fieldName as keyof AllMeasurements] = resource.attributes[key];
      }
    }
  });

  return {
    id: resource.id,
    title: resource.attributes.title,
    measurement_type: {
      id: '', // Will be populated from relationships if needed
      name: '',
      description: '',
      tid: 0,
    },
    measurements,
    created: resource.attributes.created,
    changed: resource.attributes.changed,
  };
}

// API Service Class
export class MeasurementApiService {
  // Get all measurement types
  static async getMeasurementTypes(): Promise<MeasurementType[]> {
    try {
      const response = await apiClient.get<MeasurementTypesResponse>('/taxonomy_term/measurement_type');
      return response.data.data.map(transformMeasurementType);
    } catch (error) {
      console.error('Error fetching measurement types:', error);
      throw new Error('Failed to fetch measurement types');
    }
  }

  // Get all measurements
  static async getMeasurements(): Promise<Measurement[]> {
    try {
      const response = await apiClient.get<MeasurementsResponse>('/node/measurement?include=field_measurement_type');
      return response.data.data.map(transformMeasurement);
    } catch (error) {
      console.error('Error fetching measurements:', error);
      throw new Error('Failed to fetch measurements');
    }
  }

  // Get single measurement by ID
  static async getMeasurement(id: string): Promise<Measurement> {
    try {
      const response = await apiClient.get<MeasurementResponse>(`/node/measurement/${id}?include=field_measurement_type`);
      return transformMeasurement(response.data.data);
    } catch (error) {
      console.error('Error fetching measurement:', error);
      throw new Error('Failed to fetch measurement');
    }
  }

  // Create new measurement
  static async createMeasurement(data: MeasurementFormData): Promise<Measurement> {
    try {
      // Transform form data to JSON:API format
      const jsonApiData = {
        data: {
          type: 'node--measurement',
          attributes: {
            title: data.title,
            // Add all measurement fields with field_ prefix
            ...Object.keys(data.measurements).reduce((acc, key) => {
              const value = data.measurements[key as keyof AllMeasurements];
              if (value !== undefined && value !== null) {
                acc[`field_${key}`] = value;
              }
              return acc;
            }, {} as Record<string, any>),
          },
          relationships: {
            field_measurement_type: {
              data: {
                type: 'taxonomy_term--measurement_type',
                id: data.measurement_type_id,
              },
            },
          },
        },
      };

      const response = await apiClient.post<MeasurementResponse>('/node/measurement', jsonApiData);
      return transformMeasurement(response.data.data);
    } catch (error) {
      console.error('Error creating measurement:', error);
      throw new Error('Failed to create measurement');
    }
  }

  // Update measurement
  static async updateMeasurement(id: string, data: Partial<MeasurementFormData>): Promise<Measurement> {
    try {
      const jsonApiData = {
        data: {
          type: 'node--measurement',
          id: id,
          attributes: {
            ...(data.title && { title: data.title }),
            // Add measurement fields if provided
            ...(data.measurements && Object.keys(data.measurements).reduce((acc, key) => {
              const value = data.measurements![key as keyof AllMeasurements];
              if (value !== undefined && value !== null) {
                acc[`field_${key}`] = value;
              }
              return acc;
            }, {} as Record<string, any>)),
          },
          ...(data.measurement_type_id && {
            relationships: {
              field_measurement_type: {
                data: {
                  type: 'taxonomy_term--measurement_type',
                  id: data.measurement_type_id,
                },
              },
            },
          }),
        },
      };

      const response = await apiClient.patch<MeasurementResponse>(`/node/measurement/${id}`, jsonApiData);
      return transformMeasurement(response.data.data);
    } catch (error) {
      console.error('Error updating measurement:', error);
      throw new Error('Failed to update measurement');
    }
  }

  // Delete measurement
  static async deleteMeasurement(id: string): Promise<void> {
    try {
      await apiClient.delete(`/node/measurement/${id}`);
    } catch (error) {
      console.error('Error deleting measurement:', error);
      throw new Error('Failed to delete measurement');
    }
  }
}

export default MeasurementApiService;
