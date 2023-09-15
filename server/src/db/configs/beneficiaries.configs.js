export default {
  beneficiaryId: {}, // leave this field empty because it is auto increament

  fullName: { maxLength: 45 },

  birthDate: {
    type: Date,
  },

  mobile: {
    minLength: 11,
    maxLength: 11,
  },

  address: {
    minLength: 5,
    maxLength: 100,
  },
};
