/**
 * Esquema de validación para barcode
 */
export const barcodeSchema = {
  required: ['barcode'],
  properties: {
    barcode: {
      type: 'string',
      minLength: 8,
      maxLength: 20,
      pattern: '^[0-9]+$',
    },
  },
};

/**
 * Esquema de validación para agregar medicamento
 */
export const addMedicamentoSchema = {
  required: ['barcode', 'name'],
  properties: {
    barcode: {
      type: 'string',
      minLength: 8,
      maxLength: 20,
      pattern: '^[0-9]+$',
    },
    name: {
      type: 'string',
      minLength: 3,
      maxLength: 200,
    },
    brand: {
      type: 'string',
      maxLength: 100,
    },
    composition: {
      type: 'string',
      maxLength: 200,
    },
  },
};

/**
 * Valida un objeto contra un esquema
 * @param {Object} data - Datos a validar
 * @param {Object} schema - Esquema de validación
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validate(data, schema) {
  const errors = [];
  
  // Verificar campos requeridos
  if (schema.required) {
    for (const field of schema.required) {
      if (!data[field] || data[field].trim() === '') {
        errors.push(`Campo requerido: ${field}`);
      }
    }
  }
  
  // Verificar propiedades
  if (schema.properties) {
    for (const [field, rules] of Object.entries(schema.properties)) {
      if (data[field]) {
        const value = data[field];
        
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`${field} debe tener al menos ${rules.minLength} caracteres`);
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${field} debe tener máximo ${rules.maxLength} caracteres`);
        }
        if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
          errors.push(`${field} debe contener solo números`);
        }
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
}