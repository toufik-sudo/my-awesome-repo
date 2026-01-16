export const mockImage1 = import('../assets/images/mocks/mockPhoto1.jpg');
export const mockImage2 = import('../assets/images/mocks/mockPhoto2.jpg');

export const mockPost = {
  id: 254,
  createdBy: {
    firstName: 'Adriana',
    lastName: 'Rotar',
    originalPicture: mockImage1,
    croppedPicture: mockImage2
  },
  title: 'Test Title',
  content:
    'La la la la Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  startDate: '2010-10-26T12:52:48.000000+03:00',
  likes: 0,
  confidentialityType: 1,
  file: null,
  type: 2,
  isPinned: false,
  nrOfComments: '0',
  isLiked: false,
  programs: [
    {
      id: 148,
      name: 'Test Name'
    }
  ]
};

export const agendaTasks = [
  {
    date: '2020-03-31',
    entities: [
      {
        id: 46,
        title: 'second',
        startDate: '2020-03-30T07:15:00.000000+00:00',
        endDate: '2020-03-31T07:55:48.000000+03:00',
        type: 2
      },
      {
        id: 44,
        title: 'first',
        startDate: '2020-03-30T06:00:00.000000+00:00',
        endDate: '2020-03-31T07:44:10.000000+03:00',
        type: 2
      },
      {
        id: 43,
        title: 'third',
        startDate: '2020-03-30T07:15:00.000000+00:00',
        endDate: '2020-03-31T07:41:11.000000+03:00',
        type: 2
      }
    ]
  },
  {
    date: '2020-04-01',
    entities: [
      {
        id: 3,
        title: 'z',
        startDate: '2020-03-27T17:11:32.000000+02:00',
        endDate: null,
        type: 2
      }
    ]
  },
  {
    date: '2020-04-02',
    entities: [
      {
        id: 3,
        title: 'b',
        startDate: '2020-03-27T17:11:32.000000+02:00',
        endDate: null,
        type: 2
      }
    ]
  }
];
