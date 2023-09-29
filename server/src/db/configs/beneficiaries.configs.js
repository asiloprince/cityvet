export default {
  beneficiary_id: {}, // leave this field empty because it is auto increament

  fullName: { maxLength: 45 },

  birth_date: {},

  mobile: {
    minLength: 11,
    maxLength: 11,
  },

  address: {
    minLength: 5,
    maxLength: 100,
  },
};
