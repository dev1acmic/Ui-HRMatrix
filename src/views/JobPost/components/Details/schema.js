export default {
  title: {
    presence: { allowEmpty: false }
  },
  addressId: {
    presence: { allowEmpty: false },
    numericality: {
      onlyInteger: true,
      greaterThan: 0
    }
  },
  type: {
    numericality: {
      onlyInteger: true,
      greaterThan: 0
    }
  },
  departmentId: {
    presence: { allowEmpty: false },
    numericality: {
      onlyInteger: true,
      greaterThan: 0
    }
  },
  startDate: {
    presence: {
      allowEmpty: false
    }
  },
  endDate: {
    presence: {
      allowEmpty: false
    },
    equality: {
      attribute: "startDate",
      message: "must be greater than start date",
      comparator: (v1, v2) => {
        return new Date(v1) > new Date(v2);
      }
    }
  },
  exp: {
    presence: { allowEmpty: false }
  },
  payRate: {
    presence: { allowEmpty: false }
    // format: {
    //   pattern: /^\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(.[0-9][0-9])?$/
    // }
  },
  description: {
    presence: { allowEmpty: false }
  },
  responsibility: {
    presence: { allowEmpty: false }
  },
  duration: {
    numericality: {
      onlyInteger: true,
      greaterThan: 0
    }
  },
  position: {
    presence: { allowEmpty: false },
    numericality: {
      onlyInteger: true,
      greaterThan: 0
    }
  }
};
