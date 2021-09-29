export default {
  skillRows: {
    array: {
      competency: {
        numericality: {
          onlyInteger: true,
          greaterThan: 0
        }
      },
      exp: {
        presence: { allowEmpty: false }
      },
      name: { presence: { allowEmpty: false } },
      priority: {
        numericality: {
          onlyInteger: true,
          greaterThan: 0
        }
      }
    }
  },
  educationRows: {
    array: {
      qualification: { presence: { allowEmpty: false } }
    }
  },
  interLevelRows: {
    array: {
      level: {
        numericality: {
          onlyInteger: true,
          greaterThan: 0
        }
      },
      mode: {
        numericality: {
          onlyInteger: true,
          greaterThan: 0
        }
      },
      panelId: {
        numericality: {
          onlyInteger: true,
          greaterThan: 0
        }
      }
    }
  },
  interQuestRows: {
    array: {
      question: { presence: { allowEmpty: false } },
      panelId: {
        numericality: {
          onlyInteger: true,
          greaterThan: 0
        }
      }
    }
  },
  screeningRows: {
    array: {
      priority: {
        numericality: {
          onlyInteger: true,
          greaterThan: 0
        }
      }
    }
  }
  // certificatonRows: {
  //   array: {
  //     name: { presence: { allowEmpty: false } }
  //   }
  // }
  // addDetails: {
  //   presence: { allowEmpty: false }
  // }
};
