export const LaunchQuickProgramMock = [
  {
    available: false,
    name: 'program',
    steps: [
      { component: 0, index: 1 },
      {
        component: 1,
        full: { redirectTo: '/launch/program/1', requirements: ['type', 'programJourney'] },
        index: 2,
        quick: { redirectTo: '/launch/program/1', requirements: ['type', 'programJourney'] }
      },
      {
        component: 2,
        full: { redirectTo: '/launch/program/2', requirements: ['type', 'programJourney', 'confidentiality'] },
        index: 3,
        quick: { redirectTo: '/launch/program/2', requirements: ['type', 'programJourney', 'confidentiality'] }
      }
    ]
  },
  {
    available: false,
    name: 'users',
    steps: [
      {
        component: 3,
        full: {
          redirectTo: '/launch/program/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 1,
        quick: {
          redirectTo: '/launch/program/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        }
      },
      {
        component: 4,
        full: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        },
        index: 2,
        quick: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        }
      },
      {
        component: 5,
        full: {
          redirectTo: '/launch/users/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'invitedUserData'
          ]
        },
        index: 3,
        quick: {
          redirectTo: '/launch/users/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'invitedUserData'
          ]
        }
      }
    ]
  },
  {
    available: false,
    name: 'products',
    steps: [
      {
        component: 6,
        full: {
          alternateRedirect: '/launch/users/2',
          alternateRequirements: { acceptedEmailInvitation: 'invitedUserData' },
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation'
          ]
        },
        index: 1
      },
      {
        component: 7,
        full: {
          alternateRedirect: '/launch/users/2',
          alternateRequirements: { acceptedEmailInvitation: 'invitedUserData' },
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'results',
    steps: [
      {
        component: 8,
        full: {
          alternateRedirect: '/launch/products/2',
          alternateRequirements: { personaliseProducts: 'productIds' },
          redirectTo: '/launch/products/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'personaliseProducts',
            'resultChannel'
          ]
        },
        index: 1
      },
      {
        component: 9,
        full: {
          alternateRedirect: '/launch/products/2',
          alternateRequirements: { personaliseProducts: 'productIds' },
          redirectTo: '/launch/results/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'personaliseProducts',
            'resultChannel'
          ]
        },
        index: 2
      },
      {
        component: 10,
        full: {
          redirectTo: '/launch/results/2',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 3
      }
    ]
  },
  {
    available: false,
    except: 'full',
    name: 'rewards',
    steps: [
      { component: 11, index: null },
      {
        component: 12,
        index: 1,
        quick: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        }
      }
    ]
  },
  {
    available: false,
    except: 'quick',
    name: 'rewardsFull',
    steps: [
      {
        component: 11,
        full: {
          redirectTo: '/launch/results/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 1
      },
      {
        component: 14,
        full: {
          redirectTo: '/launch/rewardsFull/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 2
      },
      {
        component: 15,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 3,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      },
      {
        component: 16,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 4,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      },
      {
        component: 13,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 5,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      }
    ]
  },
  {
    available: false,
    name: 'design',
    steps: [
      {
        component: 17,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        },
        index: 1
      },
      {
        component: 18,
        full: {
          redirectTo: '/launch/design/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'contents',
    steps: [
      {
        component: 19,
        full: {
          redirectTo: '/launch/design/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle'
          ]
        },
        index: 1
      },
      {
        component: 20,
        full: {
          redirectTo: '/launch/contents/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle',
            'wysiwigDataField',
            'contentsTitle',
            'bannerTitle'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'final',
    steps: [
      {
        component: 21,
        full: {
          redirectTo: '/launch/contents/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle',
            'wysiwigDataField',
            'contentsTitle',
            'bannerTitle',
            'socialMediaAccounts'
          ]
        },
        index: 1,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'simpleAllocation'
          ]
        }
      }
    ]
  }
];

export const MockFullLaunchProgramStep = [
  {
    available: true,
    name: 'program',
    steps: [
      { component: 0, index: 1 },
      {
        component: 1,
        full: { redirectTo: '/launch/program/1', requirements: ['type', 'programJourney'] },
        index: 2,
        quick: { redirectTo: '/launch/program/1', requirements: ['type', 'programJourney'] }
      },
      {
        component: 2,
        full: { redirectTo: '/launch/program/2', requirements: ['type', 'programJourney', 'confidentiality'] },
        index: 3,
        quick: { redirectTo: '/launch/program/2', requirements: ['type', 'programJourney', 'confidentiality'] }
      }
    ]
  },
  {
    available: false,
    name: 'users',
    steps: [
      {
        component: 3,
        full: {
          redirectTo: '/launch/program/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 1,
        quick: {
          redirectTo: '/launch/program/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        }
      },
      {
        component: 4,
        full: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        },
        index: 2,
        quick: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        }
      },
      {
        component: 5,
        full: {
          redirectTo: '/launch/users/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'invitedUserData'
          ]
        },
        index: 3,
        quick: {
          redirectTo: '/launch/users/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'invitedUserData'
          ]
        }
      }
    ]
  },
  {
    available: false,
    name: 'products',
    steps: [
      {
        component: 6,
        full: {
          alternateRedirect: '/launch/users/2',
          alternateRequirements: { acceptedEmailInvitation: 'invitedUserData' },
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation'
          ]
        },
        index: 1
      },
      {
        component: 7,
        full: {
          alternateRedirect: '/launch/users/2',
          alternateRequirements: { acceptedEmailInvitation: 'invitedUserData' },
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'results',
    steps: [
      {
        component: 8,
        full: {
          alternateRedirect: '/launch/products/2',
          alternateRequirements: { personaliseProducts: 'productIds' },
          redirectTo: '/launch/products/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'personaliseProducts',
            'resultChannel'
          ]
        },
        index: 1
      },
      {
        component: 9,
        full: {
          alternateRedirect: '/launch/products/2',
          alternateRequirements: { personaliseProducts: 'productIds' },
          redirectTo: '/launch/results/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'personaliseProducts',
            'resultChannel'
          ]
        },
        index: 2
      },
      {
        component: 10,
        full: {
          redirectTo: '/launch/results/2',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 3
      }
    ]
  },
  {
    available: false,
    except: 'full',
    name: 'rewards',
    steps: [
      { component: 11, index: null },
      {
        component: 12,
        index: 1,
        quick: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        }
      }
    ]
  },
  {
    available: false,
    except: 'quick',
    name: 'rewardsFull',
    steps: [
      {
        component: 11,
        full: {
          redirectTo: '/launch/results/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 1
      },
      {
        component: 14,
        full: {
          redirectTo: '/launch/rewardsFull/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 2
      },
      {
        component: 15,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 3,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      },
      {
        component: 16,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 4,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      },
      {
        component: 13,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 5,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      }
    ]
  },
  {
    available: false,
    name: 'design',
    steps: [
      {
        component: 17,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        },
        index: 1
      },
      {
        component: 18,
        full: {
          redirectTo: '/launch/design/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'contents',
    steps: [
      {
        component: 19,
        full: {
          redirectTo: '/launch/design/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle'
          ]
        },
        index: 1
      },
      {
        component: 20,
        full: {
          redirectTo: '/launch/contents/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle',
            'wysiwigDataField',
            'contentsTitle',
            'bannerTitle'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'final',
    steps: [
      {
        component: 21,
        full: {
          redirectTo: '/launch/contents/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle',
            'wysiwigDataField',
            'contentsTitle',
            'bannerTitle',
            'socialMediaAccounts'
          ]
        },
        index: 1,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'simpleAllocation'
          ]
        }
      }
    ]
  }
];

export const MockFullLaunchUsersStep = [
  {
    available: false,
    name: 'program',
    steps: [
      { component: 0, index: 1 },
      {
        component: 1,
        full: { redirectTo: '/launch/program/1', requirements: ['type', 'programJourney'] },
        index: 2,
        quick: { redirectTo: '/launch/program/1', requirements: ['type', 'programJourney'] }
      },
      {
        component: 2,
        full: { redirectTo: '/launch/program/2', requirements: ['type', 'programJourney', 'confidentiality'] },
        index: 3,
        quick: { redirectTo: '/launch/program/2', requirements: ['type', 'programJourney', 'confidentiality'] }
      }
    ]
  },
  {
    available: true,
    name: 'users',
    steps: [
      {
        component: 3,
        full: {
          redirectTo: '/launch/program/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 1,
        quick: {
          redirectTo: '/launch/program/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        }
      },
      {
        component: 4,
        full: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        },
        index: 2,
        quick: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        }
      },
      {
        component: 5,
        full: {
          redirectTo: '/launch/users/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'invitedUserData'
          ]
        },
        index: 3,
        quick: {
          redirectTo: '/launch/users/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'invitedUserData'
          ]
        }
      }
    ]
  },
  {
    available: false,
    name: 'products',
    steps: [
      {
        component: 6,
        full: {
          alternateRedirect: '/launch/users/2',
          alternateRequirements: { acceptedEmailInvitation: 'invitedUserData' },
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation'
          ]
        },
        index: 1
      },
      {
        component: 7,
        full: {
          alternateRedirect: '/launch/users/2',
          alternateRequirements: { acceptedEmailInvitation: 'invitedUserData' },
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'results',
    steps: [
      {
        component: 8,
        full: {
          alternateRedirect: '/launch/products/2',
          alternateRequirements: { personaliseProducts: 'productIds' },
          redirectTo: '/launch/products/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'personaliseProducts',
            'resultChannel'
          ]
        },
        index: 1
      },
      {
        component: 9,
        full: {
          alternateRedirect: '/launch/products/2',
          alternateRequirements: { personaliseProducts: 'productIds' },
          redirectTo: '/launch/results/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'personaliseProducts',
            'resultChannel'
          ]
        },
        index: 2
      },
      {
        component: 10,
        full: {
          redirectTo: '/launch/results/2',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 3
      }
    ]
  },
  {
    available: false,
    except: 'full',
    name: 'rewards',
    steps: [
      { component: 11, index: null },
      {
        component: 12,
        index: 1,
        quick: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        }
      }
    ]
  },
  {
    available: false,
    except: 'quick',
    name: 'rewardsFull',
    steps: [
      {
        component: 11,
        full: {
          redirectTo: '/launch/results/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 1
      },
      {
        component: 14,
        full: {
          redirectTo: '/launch/rewardsFull/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 2
      },
      {
        component: 15,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 3,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      },
      {
        component: 16,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 4,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      },
      {
        component: 13,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 5,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      }
    ]
  },
  {
    available: false,
    name: 'design',
    steps: [
      {
        component: 17,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        },
        index: 1
      },
      {
        component: 18,
        full: {
          redirectTo: '/launch/design/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'contents',
    steps: [
      {
        component: 19,
        full: {
          redirectTo: '/launch/design/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle'
          ]
        },
        index: 1
      },
      {
        component: 20,
        full: {
          redirectTo: '/launch/contents/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle',
            'wysiwigDataField',
            'contentsTitle',
            'bannerTitle'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'final',
    steps: [
      {
        component: 21,
        full: {
          redirectTo: '/launch/contents/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle',
            'wysiwigDataField',
            'contentsTitle',
            'bannerTitle',
            'socialMediaAccounts'
          ]
        },
        index: 1,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'simpleAllocation'
          ]
        }
      }
    ]
  }
];

export const MockFullLaunchProductsStep = [
  {
    available: false,
    name: 'program',
    steps: [
      { component: 0, index: 1 },
      {
        component: 1,
        full: { redirectTo: '/launch/program/1', requirements: ['type', 'programJourney'] },
        index: 2,
        quick: { redirectTo: '/launch/program/1', requirements: ['type', 'programJourney'] }
      },
      {
        component: 2,
        full: { redirectTo: '/launch/program/2', requirements: ['type', 'programJourney', 'confidentiality'] },
        index: 3,
        quick: { redirectTo: '/launch/program/2', requirements: ['type', 'programJourney', 'confidentiality'] }
      }
    ]
  },
  {
    available: false,
    name: 'users',
    steps: [
      {
        component: 3,
        full: {
          redirectTo: '/launch/program/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 1,
        quick: {
          redirectTo: '/launch/program/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        }
      },
      {
        component: 4,
        full: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        },
        index: 2,
        quick: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        }
      },
      {
        component: 5,
        full: {
          redirectTo: '/launch/users/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'invitedUserData'
          ]
        },
        index: 3,
        quick: {
          redirectTo: '/launch/users/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'invitedUserData'
          ]
        }
      }
    ]
  },
  {
    available: true,
    name: 'products',
    steps: [
      {
        component: 6,
        full: {
          alternateRedirect: '/launch/users/2',
          alternateRequirements: { acceptedEmailInvitation: 'invitedUserData' },
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation'
          ]
        },
        index: 1
      },
      {
        component: 7,
        full: {
          alternateRedirect: '/launch/users/2',
          alternateRequirements: { acceptedEmailInvitation: 'invitedUserData' },
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'results',
    steps: [
      {
        component: 8,
        full: {
          alternateRedirect: '/launch/products/2',
          alternateRequirements: { personaliseProducts: 'productIds' },
          redirectTo: '/launch/products/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'personaliseProducts',
            'resultChannel'
          ]
        },
        index: 1
      },
      {
        component: 9,
        full: {
          alternateRedirect: '/launch/products/2',
          alternateRequirements: { personaliseProducts: 'productIds' },
          redirectTo: '/launch/results/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'personaliseProducts',
            'resultChannel'
          ]
        },
        index: 2
      },
      {
        component: 10,
        full: {
          redirectTo: '/launch/results/2',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 3
      }
    ]
  },
  {
    available: false,
    except: 'full',
    name: 'rewards',
    steps: [
      { component: 11, index: null },
      {
        component: 12,
        index: 1,
        quick: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        }
      }
    ]
  },
  {
    available: false,
    except: 'quick',
    name: 'rewardsFull',
    steps: [
      {
        component: 11,
        full: {
          redirectTo: '/launch/results/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 1
      },
      {
        component: 14,
        full: {
          redirectTo: '/launch/rewardsFull/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 2
      },
      {
        component: 15,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 3,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      },
      {
        component: 16,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 4,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      },
      {
        component: 13,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 5,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      }
    ]
  },
  {
    available: false,
    name: 'design',
    steps: [
      {
        component: 17,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        },
        index: 1
      },
      {
        component: 18,
        full: {
          redirectTo: '/launch/design/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'contents',
    steps: [
      {
        component: 19,
        full: {
          redirectTo: '/launch/design/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle'
          ]
        },
        index: 1
      },
      {
        component: 20,
        full: {
          redirectTo: '/launch/contents/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle',
            'wysiwigDataField',
            'contentsTitle',
            'bannerTitle'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'final',
    steps: [
      {
        component: 21,
        full: {
          redirectTo: '/launch/contents/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle',
            'wysiwigDataField',
            'contentsTitle',
            'bannerTitle',
            'socialMediaAccounts'
          ]
        },
        index: 1,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'simpleAllocation'
          ]
        }
      }
    ]
  }
];

export const MockFullLaunchRewardsFullStep = [
  {
    available: false,
    name: 'program',
    steps: [
      { component: 0, index: 1 },
      {
        component: 1,
        full: { redirectTo: '/launch/program/1', requirements: ['type', 'programJourney'] },
        index: 2,
        quick: { redirectTo: '/launch/program/1', requirements: ['type', 'programJourney'] }
      },
      {
        component: 2,
        full: { redirectTo: '/launch/program/2', requirements: ['type', 'programJourney', 'confidentiality'] },
        index: 3,
        quick: { redirectTo: '/launch/program/2', requirements: ['type', 'programJourney', 'confidentiality'] }
      }
    ]
  },
  {
    available: false,
    name: 'users',
    steps: [
      {
        component: 3,
        full: {
          redirectTo: '/launch/program/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 1,
        quick: {
          redirectTo: '/launch/program/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        }
      },
      {
        component: 4,
        full: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        },
        index: 2,
        quick: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        }
      },
      {
        component: 5,
        full: {
          redirectTo: '/launch/users/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'invitedUserData'
          ]
        },
        index: 3,
        quick: {
          redirectTo: '/launch/users/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'invitedUserData'
          ]
        }
      }
    ]
  },
  {
    available: false,
    name: 'products',
    steps: [
      {
        component: 6,
        full: {
          alternateRedirect: '/launch/users/2',
          alternateRequirements: { acceptedEmailInvitation: 'invitedUserData' },
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation'
          ]
        },
        index: 1
      },
      {
        component: 7,
        full: {
          alternateRedirect: '/launch/users/2',
          alternateRequirements: { acceptedEmailInvitation: 'invitedUserData' },
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'results',
    steps: [
      {
        component: 8,
        full: {
          alternateRedirect: '/launch/products/2',
          alternateRequirements: { personaliseProducts: 'productIds' },
          redirectTo: '/launch/products/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'personaliseProducts',
            'resultChannel'
          ]
        },
        index: 1
      },
      {
        component: 9,
        full: {
          alternateRedirect: '/launch/products/2',
          alternateRequirements: { personaliseProducts: 'productIds' },
          redirectTo: '/launch/results/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'personaliseProducts',
            'resultChannel'
          ]
        },
        index: 2
      },
      {
        component: 10,
        full: {
          redirectTo: '/launch/results/2',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 3
      }
    ]
  },
  {
    available: true,
    except: 'full',
    name: 'rewards',
    steps: [
      { component: 11, index: null },
      {
        component: 12,
        index: 1,
        quick: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        }
      }
    ]
  },
  {
    available: true,
    except: 'quick',
    name: 'rewardsFull',
    steps: [
      {
        component: 11,
        full: {
          redirectTo: '/launch/results/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 1
      },
      {
        component: 14,
        full: {
          redirectTo: '/launch/rewardsFull/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 2
      },
      {
        component: 15,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 3,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      },
      {
        component: 16,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 4,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      },
      {
        component: 13,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 5,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      }
    ]
  },
  {
    available: false,
    name: 'design',
    steps: [
      {
        component: 17,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        },
        index: 1
      },
      {
        component: 18,
        full: {
          redirectTo: '/launch/design/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'contents',
    steps: [
      {
        component: 19,
        full: {
          redirectTo: '/launch/design/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle'
          ]
        },
        index: 1
      },
      {
        component: 20,
        full: {
          redirectTo: '/launch/contents/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle',
            'wysiwigDataField',
            'contentsTitle',
            'bannerTitle'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'final',
    steps: [
      {
        component: 21,
        full: {
          redirectTo: '/launch/contents/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle',
            'wysiwigDataField',
            'contentsTitle',
            'bannerTitle',
            'socialMediaAccounts'
          ]
        },
        index: 1,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'simpleAllocation'
          ]
        }
      }
    ]
  }
];

export const MockFullLaunchDesignStep = [
  {
    available: false,
    name: 'program',
    steps: [
      { component: 0, index: 1 },
      {
        component: 1,
        full: { redirectTo: '/launch/program/1', requirements: ['type', 'programJourney'] },
        index: 2,
        quick: { redirectTo: '/launch/program/1', requirements: ['type', 'programJourney'] }
      },
      {
        component: 2,
        full: { redirectTo: '/launch/program/2', requirements: ['type', 'programJourney', 'confidentiality'] },
        index: 3,
        quick: { redirectTo: '/launch/program/2', requirements: ['type', 'programJourney', 'confidentiality'] }
      }
    ]
  },
  {
    available: false,
    name: 'users',
    steps: [
      {
        component: 3,
        full: {
          redirectTo: '/launch/program/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 1,
        quick: {
          redirectTo: '/launch/program/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        }
      },
      {
        component: 4,
        full: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        },
        index: 2,
        quick: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        }
      },
      {
        component: 5,
        full: {
          redirectTo: '/launch/users/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'invitedUserData'
          ]
        },
        index: 3,
        quick: {
          redirectTo: '/launch/users/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'invitedUserData'
          ]
        }
      }
    ]
  },
  {
    available: false,
    name: 'products',
    steps: [
      {
        component: 6,
        full: {
          alternateRedirect: '/launch/users/2',
          alternateRequirements: { acceptedEmailInvitation: 'invitedUserData' },
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation'
          ]
        },
        index: 1
      },
      {
        component: 7,
        full: {
          alternateRedirect: '/launch/users/2',
          alternateRequirements: { acceptedEmailInvitation: 'invitedUserData' },
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'results',
    steps: [
      {
        component: 8,
        full: {
          alternateRedirect: '/launch/products/2',
          alternateRequirements: { personaliseProducts: 'productIds' },
          redirectTo: '/launch/products/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'personaliseProducts',
            'resultChannel'
          ]
        },
        index: 1
      },
      {
        component: 9,
        full: {
          alternateRedirect: '/launch/products/2',
          alternateRequirements: { personaliseProducts: 'productIds' },
          redirectTo: '/launch/results/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'personaliseProducts',
            'resultChannel'
          ]
        },
        index: 2
      },
      {
        component: 10,
        full: {
          redirectTo: '/launch/results/2',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 3
      }
    ]
  },
  {
    available: false,
    except: 'full',
    name: 'rewards',
    steps: [
      { component: 11, index: null },
      {
        component: 12,
        index: 1,
        quick: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        }
      }
    ]
  },
  {
    available: false,
    except: 'quick',
    name: 'rewardsFull',
    steps: [
      {
        component: 11,
        full: {
          redirectTo: '/launch/results/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 1
      },
      {
        component: 14,
        full: {
          redirectTo: '/launch/rewardsFull/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 2
      },
      {
        component: 15,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 3,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      },
      {
        component: 16,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 4,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      },
      {
        component: 13,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 5,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      }
    ]
  },
  {
    available: true,
    name: 'design',
    steps: [
      {
        component: 17,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        },
        index: 1
      },
      {
        component: 18,
        full: {
          redirectTo: '/launch/design/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'contents',
    steps: [
      {
        component: 19,
        full: {
          redirectTo: '/launch/design/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle'
          ]
        },
        index: 1
      },
      {
        component: 20,
        full: {
          redirectTo: '/launch/contents/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle',
            'wysiwigDataField',
            'contentsTitle',
            'bannerTitle'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'final',
    steps: [
      {
        component: 21,
        full: {
          redirectTo: '/launch/contents/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle',
            'wysiwigDataField',
            'contentsTitle',
            'bannerTitle',
            'socialMediaAccounts'
          ]
        },
        index: 1,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'simpleAllocation'
          ]
        }
      }
    ]
  }
];

export const MockFullLaunchResultsStep = [
  {
    available: false,
    name: 'program',
    steps: [
      { component: 0, index: 1 },
      {
        component: 1,
        full: { redirectTo: '/launch/program/1', requirements: ['type', 'programJourney'] },
        index: 2,
        quick: { redirectTo: '/launch/program/1', requirements: ['type', 'programJourney'] }
      },
      {
        component: 2,
        full: { redirectTo: '/launch/program/2', requirements: ['type', 'programJourney', 'confidentiality'] },
        index: 3,
        quick: { redirectTo: '/launch/program/2', requirements: ['type', 'programJourney', 'confidentiality'] }
      }
    ]
  },
  {
    available: false,
    name: 'users',
    steps: [
      {
        component: 3,
        full: {
          redirectTo: '/launch/program/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 1,
        quick: {
          redirectTo: '/launch/program/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        }
      },
      {
        component: 4,
        full: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        },
        index: 2,
        quick: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        }
      },
      {
        component: 5,
        full: {
          redirectTo: '/launch/users/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'invitedUserData'
          ]
        },
        index: 3,
        quick: {
          redirectTo: '/launch/users/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'invitedUserData'
          ]
        }
      }
    ]
  },
  {
    available: false,
    name: 'products',
    steps: [
      {
        component: 6,
        full: {
          alternateRedirect: '/launch/users/2',
          alternateRequirements: { acceptedEmailInvitation: 'invitedUserData' },
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation'
          ]
        },
        index: 1
      },
      {
        component: 7,
        full: {
          alternateRedirect: '/launch/users/2',
          alternateRequirements: { acceptedEmailInvitation: 'invitedUserData' },
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: true,
    name: 'results',
    steps: [
      {
        component: 8,
        full: {
          alternateRedirect: '/launch/products/2',
          alternateRequirements: { personaliseProducts: 'productIds' },
          redirectTo: '/launch/products/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'personaliseProducts',
            'resultChannel'
          ]
        },
        index: 1
      },
      {
        component: 9,
        full: {
          alternateRedirect: '/launch/products/2',
          alternateRequirements: { personaliseProducts: 'productIds' },
          redirectTo: '/launch/results/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'personaliseProducts',
            'resultChannel'
          ]
        },
        index: 2
      },
      {
        component: 10,
        full: {
          redirectTo: '/launch/results/2',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 3
      }
    ]
  },
  {
    available: false,
    except: 'full',
    name: 'rewards',
    steps: [
      { component: 11, index: null },
      {
        component: 12,
        index: 1,
        quick: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        }
      }
    ]
  },
  {
    available: false,
    except: 'quick',
    name: 'rewardsFull',
    steps: [
      {
        component: 11,
        full: {
          redirectTo: '/launch/results/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 1
      },
      {
        component: 14,
        full: {
          redirectTo: '/launch/rewardsFull/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 2
      },
      {
        component: 15,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 3,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      },
      {
        component: 16,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 4,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      },
      {
        component: 13,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 5,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      }
    ]
  },
  {
    available: false,
    name: 'design',
    steps: [
      {
        component: 17,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        },
        index: 1
      },
      {
        component: 18,
        full: {
          redirectTo: '/launch/design/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'contents',
    steps: [
      {
        component: 19,
        full: {
          redirectTo: '/launch/design/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle'
          ]
        },
        index: 1
      },
      {
        component: 20,
        full: {
          redirectTo: '/launch/contents/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle',
            'wysiwigDataField',
            'contentsTitle',
            'bannerTitle'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'final',
    steps: [
      {
        component: 21,
        full: {
          redirectTo: '/launch/contents/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle',
            'wysiwigDataField',
            'contentsTitle',
            'bannerTitle',
            'socialMediaAccounts'
          ]
        },
        index: 1,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'simpleAllocation'
          ]
        }
      }
    ]
  }
];

export const MockFullLaunchContentsStep = [
  {
    available: false,
    name: 'program',
    steps: [
      { component: 0, index: 1 },
      {
        component: 1,
        full: { redirectTo: '/launch/program/1', requirements: ['type', 'programJourney'] },
        index: 2,
        quick: { redirectTo: '/launch/program/1', requirements: ['type', 'programJourney'] }
      },
      {
        component: 2,
        full: { redirectTo: '/launch/program/2', requirements: ['type', 'programJourney', 'confidentiality'] },
        index: 3,
        quick: { redirectTo: '/launch/program/2', requirements: ['type', 'programJourney', 'confidentiality'] }
      }
    ]
  },
  {
    available: false,
    name: 'users',
    steps: [
      {
        component: 3,
        full: {
          redirectTo: '/launch/program/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 1,
        quick: {
          redirectTo: '/launch/program/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        }
      },
      {
        component: 4,
        full: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        },
        index: 2,
        quick: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        }
      },
      {
        component: 5,
        full: {
          redirectTo: '/launch/users/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'invitedUserData'
          ]
        },
        index: 3,
        quick: {
          redirectTo: '/launch/users/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'invitedUserData'
          ]
        }
      }
    ]
  },
  {
    available: false,
    name: 'products',
    steps: [
      {
        component: 6,
        full: {
          alternateRedirect: '/launch/users/2',
          alternateRequirements: { acceptedEmailInvitation: 'invitedUserData' },
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation'
          ]
        },
        index: 1
      },
      {
        component: 7,
        full: {
          alternateRedirect: '/launch/users/2',
          alternateRequirements: { acceptedEmailInvitation: 'invitedUserData' },
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'results',
    steps: [
      {
        component: 8,
        full: {
          alternateRedirect: '/launch/products/2',
          alternateRequirements: { personaliseProducts: 'productIds' },
          redirectTo: '/launch/products/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'personaliseProducts',
            'resultChannel'
          ]
        },
        index: 1
      },
      {
        component: 9,
        full: {
          alternateRedirect: '/launch/products/2',
          alternateRequirements: { personaliseProducts: 'productIds' },
          redirectTo: '/launch/results/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'personaliseProducts',
            'resultChannel'
          ]
        },
        index: 2
      },
      {
        component: 10,
        full: {
          redirectTo: '/launch/results/2',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 3
      }
    ]
  },
  {
    available: false,
    except: 'full',
    name: 'rewards',
    steps: [
      { component: 11, index: null },
      {
        component: 12,
        index: 1,
        quick: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        }
      }
    ]
  },
  {
    available: false,
    except: 'quick',
    name: 'rewardsFull',
    steps: [
      {
        component: 11,
        full: {
          redirectTo: '/launch/results/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 1
      },
      {
        component: 14,
        full: {
          redirectTo: '/launch/rewardsFull/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 2
      },
      {
        component: 15,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 3,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      },
      {
        component: 16,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 4,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      },
      {
        component: 13,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 5,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      }
    ]
  },
  {
    available: false,
    name: 'design',
    steps: [
      {
        component: 17,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        },
        index: 1
      },
      {
        component: 18,
        full: {
          redirectTo: '/launch/design/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: true,
    name: 'contents',
    steps: [
      {
        component: 19,
        full: {
          redirectTo: '/launch/design/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle'
          ]
        },
        index: 1
      },
      {
        component: 20,
        full: {
          redirectTo: '/launch/contents/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle',
            'wysiwigDataField',
            'contentsTitle',
            'bannerTitle'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'final',
    steps: [
      {
        component: 21,
        full: {
          redirectTo: '/launch/contents/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle',
            'wysiwigDataField',
            'contentsTitle',
            'bannerTitle',
            'socialMediaAccounts'
          ]
        },
        index: 1,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'simpleAllocation'
          ]
        }
      }
    ]
  }
];

export const MockFullLaunchFinalStep = [
  {
    available: false,
    name: 'program',
    steps: [
      { component: 0, index: 1 },
      {
        component: 1,
        full: { redirectTo: '/launch/program/1', requirements: ['type', 'programJourney'] },
        index: 2,
        quick: { redirectTo: '/launch/program/1', requirements: ['type', 'programJourney'] }
      },
      {
        component: 2,
        full: { redirectTo: '/launch/program/2', requirements: ['type', 'programJourney', 'confidentiality'] },
        index: 3,
        quick: { redirectTo: '/launch/program/2', requirements: ['type', 'programJourney', 'confidentiality'] }
      }
    ]
  },
  {
    available: false,
    name: 'users',
    steps: [
      {
        component: 3,
        full: {
          redirectTo: '/launch/program/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 1,
        quick: {
          redirectTo: '/launch/program/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        }
      },
      {
        component: 4,
        full: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        },
        index: 2,
        quick: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        }
      },
      {
        component: 5,
        full: {
          redirectTo: '/launch/users/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'invitedUserData'
          ]
        },
        index: 3,
        quick: {
          redirectTo: '/launch/users/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'invitedUserData'
          ]
        }
      }
    ]
  },
  {
    available: false,
    name: 'products',
    steps: [
      {
        component: 6,
        full: {
          alternateRedirect: '/launch/users/2',
          alternateRequirements: { acceptedEmailInvitation: 'invitedUserData' },
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation'
          ]
        },
        index: 1
      },
      {
        component: 7,
        full: {
          alternateRedirect: '/launch/users/2',
          alternateRequirements: { acceptedEmailInvitation: 'invitedUserData' },
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'results',
    steps: [
      {
        component: 8,
        full: {
          alternateRedirect: '/launch/products/2',
          alternateRequirements: { personaliseProducts: 'productIds' },
          redirectTo: '/launch/products/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'personaliseProducts',
            'resultChannel'
          ]
        },
        index: 1
      },
      {
        component: 9,
        full: {
          alternateRedirect: '/launch/products/2',
          alternateRequirements: { personaliseProducts: 'productIds' },
          redirectTo: '/launch/results/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'personaliseProducts',
            'resultChannel'
          ]
        },
        index: 2
      },
      {
        component: 10,
        full: {
          redirectTo: '/launch/results/2',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 3
      }
    ]
  },
  {
    available: false,
    except: 'full',
    name: 'rewards',
    steps: [
      { component: 11, index: null },
      {
        component: 12,
        index: 1,
        quick: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        }
      }
    ]
  },
  {
    available: false,
    except: 'quick',
    name: 'rewardsFull',
    steps: [
      {
        component: 11,
        full: {
          redirectTo: '/launch/results/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 1
      },
      {
        component: 14,
        full: {
          redirectTo: '/launch/rewardsFull/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 2
      },
      {
        component: 15,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 3,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      },
      {
        component: 16,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 4,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      },
      {
        component: 13,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'correlatedGoals'
          ]
        },
        index: 5,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        }
      }
    ]
  },
  {
    available: false,
    name: 'design',
    steps: [
      {
        component: 17,
        full: {
          redirectTo: '/launch/rewardsFull/2',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl', 'cube']
        },
        index: 1
      },
      {
        component: 18,
        full: {
          redirectTo: '/launch/design/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: false,
    name: 'contents',
    steps: [
      {
        component: 19,
        full: {
          redirectTo: '/launch/design/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle'
          ]
        },
        index: 1
      },
      {
        component: 20,
        full: {
          redirectTo: '/launch/contents/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle',
            'wysiwigDataField',
            'contentsTitle',
            'bannerTitle'
          ]
        },
        index: 2
      }
    ]
  },
  {
    available: true,
    name: 'final',
    steps: [
      {
        component: 21,
        full: {
          redirectTo: '/launch/contents/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle',
            'wysiwigDataField',
            'contentsTitle',
            'bannerTitle',
            'socialMediaAccounts'
          ]
        },
        index: 1,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'simpleAllocation'
          ]
        }
      }
    ]
  }
];

export const MockQuickLaunchProgramStep = [
  {
    name: 'program',
    steps: [
      {
        component: 0,
        index: 1
      },
      {
        component: 1,
        full: {
          redirectTo: '/launch/program/1',
          requirements: ['type', 'programJourney']
        },
        index: 2,
        quick: {
          redirectTo: '/launch/program/1',
          requirements: ['type', 'programJourney']
        }
      },
      {
        component: 2,
        full: {
          redirectTo: '/launch/program/2',
          requirements: ['type', 'programJourney', 'confidentiality']
        },
        index: 3,
        quick: {
          redirectTo: '/launch/program/2',
          requirements: ['type', 'programJourney', 'confidentiality']
        }
      }
    ]
  }
];

export const MockQuickLaunchUserstStep = [
  {
    name: 'users',
    steps: [
      {
        component: 3,
        full: {
          redirectTo: '/launch/program/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        },
        index: 1,
        quick: {
          redirectTo: '/launch/program/3',
          requirements: ['type', 'programJourney', 'confidentiality', 'programName', 'url', 'extendUrl']
        }
      },
      {
        component: 4,
        full: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        },
        index: 2,
        quick: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        }
      },
      {
        component: 5,
        full: {
          redirectTo: '/launch/users/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'invitedUserData'
          ]
        },
        index: 3,
        quick: {
          redirectTo: '/launch/users/2',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'invitedUserData'
          ]
        }
      }
    ]
  }
];

export const MockQuickLaunchRewardsStep = [
  {
    except: 'full',
    name: 'rewards',
    steps: [
      { component: 11, index: null },
      {
        component: 12,
        index: 1,
        quick: {
          redirectTo: '/launch/users/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields'
          ]
        }
      }
    ]
  }
];

export const MockQuickLaunchFinalStep = [
  {
    name: 'final',
    steps: [
      {
        component: 21,
        full: {
          redirectTo: '/launch/contents/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'cube',
            'companyLogo',
            'companyName',
            'identificationCover',
            'identificationCoverId',
            'identificationTitle',
            'wysiwigDataField',
            'contentsTitle',
            'bannerTitle',
            'socialMediaAccounts'
          ]
        },
        index: 1,
        quick: {
          redirectTo: '/launch/rewards/1',
          requirements: [
            'type',
            'programJourney',
            'confidentiality',
            'programName',
            'url',
            'extendUrl',
            'acceptedEmailInvitation',
            'invitedUsersFields',
            'simpleAllocation'
          ]
        }
      }
    ]
  }
];

export const MockGetAvailableStatus = { nextAvailable: false, prevAvailable: undefined };

export const MockProcessBarItemStyle = {
  index: 1,
  style: 'normal',
  stopDetail: {
    step: 1,
    steps: [
      {
        name: 'name',
        available: true
      },
      {
        name: 'name1',
        available: false
      }
    ],
    stepKey: 1,
    currentActiveStep: 3
  }
};

export const MockResponseProcessBarItemStyle = {
  progressActive: '',
  progressAvailable: undefined,
  progressCompleted: undefined
};
