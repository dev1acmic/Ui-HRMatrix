export default {
  skillRows: {
    array: {
      // competency: {
      //   numericality: {
      //     onlyInteger: true,
      //     greaterThan: 0
      //   }
      // },
      exp: {
        presence: { allowEmpty: false }
      }
    }
  },
  educationRows: {
    array: {
      qualification: { presence: { allowEmpty: false } }
      // institution: { presence: { allowEmpty: false } },
      // year: {
      //   presence: { allowEmpty: false }
      // },
      // gpa: {
      //   presence: { allowEmpty: false }
      // }
    }
  },
  certificatonRows: {
    array: {
      name: {
        presence: { allowEmpty: false }
      }
      // year: {
      //   presence: { allowEmpty: false }
      // }
    }
  },
  employmentRows: {
    array: {
      company: { presence: { allowEmpty: false } },
      title: { presence: { allowEmpty: false } },
      strtYear: {
        presence: { allowEmpty: false }
      },
      strtMonth: {
        numericality: {
          onlyInteger: true,
          greaterThan: 0
        }
      },
      // endYear: {
      //   presence: { allowEmpty: false }
      // },
      // endMonth: {
      //   numericality: {
      //     onlyInteger: true,
      //     greaterThan: 0
      //   }
      // }
    }
  }
};
