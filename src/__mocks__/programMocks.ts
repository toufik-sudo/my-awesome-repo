export const programsHyperMock = {
  platforms: [
    {
      id: 3,
      name: 'The one and only Hyper platform',
      nrOfPrograms: 3,
      role: 6,
      status: 1,
      hierarchicType: 4,
      parentPlatformId: null,
      programs: []
    },
    {
      id: 77,
      name: 'Super platform A',
      nrOfPrograms: 3,
      role: 6,
      hierarchicType: 3,
      parentPlatformId: 3,
      subPlatforms: [
        {
          id: 111,
          name: 'Sub platform A',
          nrOfPrograms: 3,
          role: 6,
          hierarchicType: 2,
          parentPlatformId: 77,
          programs: []
        },
        {
          id: 1,
          name: 'Real Sub Platform',
          nrOfPrograms: 3,
          role: 6,
          hierarchicType: 2,
          parentPlatformId: 77,
          programs: [
            {
              id: 1,
              name: 'real program id',
              design: [],
              programStatus: 1,
              status: 'joined',
              createdAt: '2020-04-30T05:51:25+00:00',
              updatedAt: '2020-05-06T12:13:21+00:00',
              isPeopleManager: false,
              subscribed: false,
              programType: 1,
              isOpen: true,
              joinedAt: '2020-04-30T05:31:42+00:00',
              requestToJoinAt: null,
              startDate: '2020-04-30T00:00:00+00:00',
              endDate: '2020-05-02T23:59:59+00:00'
            },
            {
              id: 45,
              name: 'test',
              design: {
                companyName: 'test',
                companyLogoUrl:
                  'https://s3.eu-west-3.amazonaws.com/cr-dev-user-profile-images/blob_15885936465eb003ee942ac.',
                backgroundCoverUrl:
                  'https://s3.eu-west-3.amazonaws.com/cr-dev-user-profile-images/blob_15885936475eb003ef71bdc.',
                colorMainButtons: '#ff0c28',
                colorSidebar: '#051bfb',
                colorTitles: null,
                colorMenu: '#04fb89',
                colorContent: '#f9f205',
                colorTask: '#f906f9',
                colorFont: '#7f7f7f',
                colorBackground: '#f97906',
                font: 'Roboto'
              },
              programStatus: 1,
              status: 'joined',
              createdAt: '2020-05-04T12:01:04+00:00',
              updatedAt: '2020-05-06T12:16:45+00:00',
              isPeopleManager: false,
              subscribed: false,
              programType: 1,
              isOpen: true,
              joinedAt: '2020-04-30T05:31:42+00:00',
              requestToJoinAt: null,
              startDate: '2020-05-04T00:00:00+00:00',
              endDate: '2020-06-05T23:59:59+00:00'
            },
            {
              id: 67,
              name: 'My program',
              design: {
                companyName: 'Pedigree',
                companyLogoUrl:
                  'https://s3.eu-west-3.amazonaws.com/cr-dev-user-profile-images/blob_15887709585eb2b88e610bc.',
                backgroundCoverUrl:
                  'https://s3.eu-west-3.amazonaws.com/cr-dev-user-profile-images/blob_15887709595eb2b88f2b51c.',
                colorMainButtons: '#EC407A',
                colorSidebar: '#EC407A',
                colorTitles: null,
                colorMenu: '#EC407A',
                colorContent: '#3e216b',
                colorTask: '#78bb7bcf',
                colorFont: '#000000',
                colorBackground: '#EDEDED',
                font: 'Roboto'
              },
              programStatus: 1,
              status: 'invited',
              createdAt: '2020-05-06T13:16:48+00:00',
              updatedAt: null,
              isPeopleManager: false,
              subscribed: false,
              programType: 1,
              isOpen: true,
              joinedAt: '2020-04-30T05:31:42+00:00',
              requestToJoinAt: null,
              startDate: '2020-05-06T00:00:00+00:00',
              endDate: '2020-05-28T23:59:59+00:00'
            },
            {
              id: 68,
              name: 'test',
              design: [],
              programStatus: 1,
              status: 'joined',
              createdAt: '2020-05-06T13:25:09+00:00',
              updatedAt: null,
              isPeopleManager: false,
              subscribed: false,
              programType: 1,
              isOpen: true,
              joinedAt: '2020-04-30T05:31:42+00:00',
              requestToJoinAt: null,
              startDate: '2020-05-06T00:00:00+00:00',
              endDate: '2020-06-03T23:59:59+00:00'
            }
          ]
        },
        {
          id: 17,
          name: 'Sub platform C',
          nrOfPrograms: 3,
          role: 6,
          hierarchicType: 2,
          parentPlatformId: 14,
          programs: []
        }
      ]
    },
    {
      id: 18,
      name: "A platform i've created myself and on which I am an admin",
      nrOfPrograms: 3,
      role: 1,
      hierarchicType: 1,
      platformType: {
        id: 3,
        name: 'best seller'
      },
      parentPlatformId: null,
      programs: [
        {
          id: 19,
          name: 'test',
          design: [],
          programStatus: 1,
          status: 'joined',
          createdAt: '2020-05-06T13:25:09+00:00',
          updatedAt: null,
          isPeopleManager: false,
          subscribed: false,
          programType: 1,
          isOpen: false,
          joinedAt: '2020-04-30T05:31:42+00:00',
          requestToJoinAt: null,
          startDate: '2020-05-06T00:00:00+00:00',
          endDate: '2020-06-03T23:59:59+00:00'
        }
      ]
    },
    {
      id: 8,
      name: 'URSS',
      nrOfPrograms: 3,
      role: 3,
      hierarchicType: 1,
      platformType: {
        id: 3,
        name: 'freemium'
      },
      parentPlatformId: null,
      programs: [
        {
          id: 9,
          name: 'fULL LAUNCH TEST 1',
          programStatus: 1,
          status: 'joined',
          isPeopleManager: false,
          design: {
            companyName: 'Adidas',
            companyLogoUrl: 'http://s3-url.com/image.jpg',
            backgroundCoverUrl: 'http://s3-url.com/image.jpg',
            colorMainButtons: '#1d61d4',
            colorSidebarTitles: '#1d61d4',
            colorMenu: '#1d61d4',
            colorContent: '#1d61d4',
            colorTask: '#1d61d4',
            colorFont: '#1d61d4',
            colorBackground: '#1d61d4',
            font: 'Roboto'
          },
          createdAt: '2019-10-25T12:52:48.467Z',
          updatedAt: '2019-10-25T12:52:48.467Z',
          subscribed: false,
          isOpen: true,
          programType: 1,
          visitedWall: true
        }
      ]
    }
  ]
};
