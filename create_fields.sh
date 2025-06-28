#!/bin/bash

# Array of field names for all measurement fields
fields=(
    "field_qameez_chest"
    "field_qameez_waist"
    "field_qameez_hip"
    "field_qameez_shoulder"
    "field_qameez_sleeve_length"
    "field_qameez_neck"
    "field_qameez_armhole"
    "field_shalwar_length"
    "field_shalwar_waist"
    "field_shalwar_hip"
    "field_shalwar_thigh"
    "field_shalwar_bottom"
    "field_shalwar_knee"
    "field_shirt_length"
    "field_shirt_chest"
    "field_shirt_waist"
    "field_shirt_shoulder"
    "field_shirt_sleeve_length"
    "field_shirt_neck"
    "field_shirt_armhole"
    "field_shirt_cuff"
    "field_coat_length"
    "field_coat_chest"
    "field_coat_waist"
    "field_coat_hip"
    "field_coat_shoulder"
    "field_coat_sleeve_length"
    "field_coat_neck"
    "field_coat_armhole"
    "field_coat_lapel_width"
    "field_waistcoat_length"
    "field_waistcoat_chest"
    "field_waistcoat_waist"
    "field_waistcoat_shoulder"
    "field_waistcoat_armhole"
    "field_waistcoat_neck"
)

# Create field storage configurations
for field in "${fields[@]}"; do
    cat > "config/sync/field.storage.node.${field}.yml" << EOF
langcode: en
status: true
dependencies:
  module:
    - node
id: node.${field}
field_name: ${field}
entity_type: node
type: decimal
settings:
  precision: 5
  scale: 2
module: core
locked: false
cardinality: 1
translatable: true
indexes: {  }
persist_with_no_fields: false
custom_storage: false
EOF
done

echo "Field storage configurations created successfully!"
