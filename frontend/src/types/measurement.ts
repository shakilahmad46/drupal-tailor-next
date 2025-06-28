// Drupal JSON:API response types
export interface JsonApiResponse<T> {
  data: T;
  links?: {
    self: { href: string };
    next?: { href: string };
    prev?: { href: string };
  };
  meta?: any;
}

export interface JsonApiResource {
  type: string;
  id: string;
  attributes: Record<string, any>;
  relationships?: Record<string, any>;
  links?: {
    self: { href: string };
  };
}

// Taxonomy Term Types
export interface MeasurementType {
  id: string;
  name: string;
  description: string;
  tid: number;
}

// Measurement Field Types
export interface ShalwarQameezMeasurements {
  qameez_length?: number;
  qameez_chest?: number;
  qameez_waist?: number;
  qameez_hip?: number;
  qameez_shoulder?: number;
  qameez_sleeve_length?: number;
  qameez_neck?: number;
  qameez_armhole?: number;
  shalwar_length?: number;
  shalwar_waist?: number;
  shalwar_hip?: number;
  shalwar_thigh?: number;
  shalwar_bottom?: number;
  shalwar_knee?: number;
}

export interface ShirtMeasurements {
  shirt_length?: number;
  shirt_chest?: number;
  shirt_waist?: number;
  shirt_shoulder?: number;
  shirt_sleeve_length?: number;
  shirt_neck?: number;
  shirt_armhole?: number;
  shirt_cuff?: number;
}

export interface CoatMeasurements {
  coat_length?: number;
  coat_chest?: number;
  coat_waist?: number;
  coat_hip?: number;
  coat_shoulder?: number;
  coat_sleeve_length?: number;
  coat_neck?: number;
  coat_armhole?: number;
  coat_lapel_width?: number;
}

export interface WaistcoatMeasurements {
  waistcoat_length?: number;
  waistcoat_chest?: number;
  waistcoat_waist?: number;
  waistcoat_shoulder?: number;
  waistcoat_armhole?: number;
  waistcoat_neck?: number;
}

export type AllMeasurements = ShalwarQameezMeasurements & 
  ShirtMeasurements & 
  CoatMeasurements & 
  WaistcoatMeasurements;

// Main Measurement Entity
export interface Measurement {
  id: string;
  title: string;
  measurement_type: MeasurementType;
  measurements: AllMeasurements;
  created: string;
  changed: string;
}

// Form Data Types
export interface MeasurementFormData {
  title: string;
  measurement_type_id: string;
  measurements: Partial<AllMeasurements>;
}

// API Response Types
export type MeasurementTypesResponse = JsonApiResponse<JsonApiResource[]>;
export type MeasurementsResponse = JsonApiResponse<JsonApiResource[]>;
export type MeasurementResponse = JsonApiResponse<JsonApiResource>;
