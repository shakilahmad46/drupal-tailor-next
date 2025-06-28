#!/bin/bash

# Array of field configurations: field_name:label:description
fields=(
    "field_qameez_chest:Qameez Chest:Chest measurement for Qameez"
    "field_qameez_waist:Qameez Waist:Waist measurement for Qameez"
    "field_qameez_hip:Qameez Hip:Hip measurement for Qameez"
    "field_qameez_shoulder:Qameez Shoulder:Shoulder measurement for Qameez"
    "field_qameez_sleeve_length:Qameez Sleeve Length:Sleeve length for Qameez"
    "field_qameez_neck:Qameez Neck:Neck measurement for Qameez"
    "field_qameez_armhole:Qameez Armhole:Armhole measurement for Qameez"
    "field_shalwar_length:Shalwar Length:Length measurement for Shalwar"
    "field_shalwar_waist:Shalwar Waist:Waist measurement for Shalwar"
    "field_shalwar_hip:Shalwar Hip:Hip measurement for Shalwar"
    "field_shalwar_thigh:Shalwar Thigh:Thigh measurement for Shalwar"
    "field_shalwar_bottom:Shalwar Bottom:Bottom measurement for Shalwar"
    "field_shalwar_knee:Shalwar Knee:Knee measurement for Shalwar"
    "field_shirt_length:Shirt Length:Length measurement for Shirt"
    "field_shirt_chest:Shirt Chest:Chest measurement for Shirt"
    "field_shirt_waist:Shirt Waist:Waist measurement for Shirt"
    "field_shirt_shoulder:Shirt Shoulder:Shoulder measurement for Shirt"
    "field_shirt_sleeve_length:Shirt Sleeve Length:Sleeve length for Shirt"
    "field_shirt_neck:Shirt Neck:Neck measurement for Shirt"
    "field_shirt_armhole:Shirt Armhole:Armhole measurement for Shirt"
    "field_shirt_cuff:Shirt Cuff:Cuff measurement for Shirt"
    "field_coat_length:Coat Length:Length measurement for Coat"
    "field_coat_chest:Coat Chest:Chest measurement for Coat"
    "field_coat_waist:Coat Waist:Waist measurement for Coat"
    "field_coat_hip:Coat Hip:Hip measurement for Coat"
    "field_coat_shoulder:Coat Shoulder:Shoulder measurement for Coat"
    "field_coat_sleeve_length:Coat Sleeve Length:Sleeve length for Coat"
    "field_coat_neck:Coat Neck:Neck measurement for Coat"
    "field_coat_armhole:Coat Armhole:Armhole measurement for Coat"
    "field_coat_lapel_width:Coat Lapel Width:Lapel width for Coat"
    "field_waistcoat_length:Waistcoat Length:Length measurement for Waistcoat"
    "field_waistcoat_chest:Waistcoat Chest:Chest measurement for Waistcoat"
    "field_waistcoat_waist:Waistcoat Waist:Waist measurement for Waistcoat"
    "field_waistcoat_shoulder:Waistcoat Shoulder:Shoulder measurement for Waistcoat"
    "field_waistcoat_armhole:Waistcoat Armhole:Armhole measurement for Waistcoat"
    "field_waistcoat_neck:Waistcoat Neck:Neck measurement for Waistcoat"
)

# Create field instance configurations
for field_config in "${fields[@]}"; do
    IFS=':' read -r field_name label description <<< "$field_config"
    
    cat > "config/sync/field.field.node.measurement.${field_name}.yml" << EOF
langcode: en
status: true
dependencies:
  config:
    - field.storage.node.${field_name}
    - node.type.measurement
id: node.measurement.${field_name}
field_name: ${field_name}
entity_type: node
bundle: measurement
label: '${label}'
description: '${description}'
required: false
translatable: false
default_value: {  }
default_value_callback: ''
settings:
  min: 0
  max: null
  prefix: ''
  suffix: ' inches'
field_type: decimal
EOF
done

echo "Field instance configurations created successfully!"
