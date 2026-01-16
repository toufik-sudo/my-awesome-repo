import { initializeDates, prepareAgendaTasks } from 'services/AgendaServices';
import { agendaTasks } from '__mocks__/wallMocks';

describe('initializeDates', () => {
  test('should correctly return dates when initial date before max past date', () => {
    const initialDate = new Date('2020-03-28');
    const maxPreviousDate = new Date('2020-03-26');

    const dates = initializeDates(initialDate, maxPreviousDate);
    expect(dates.previous).toBeDefined();
    expect(dates.previous.getDate()).toBe(27);
    expect(dates.next.getDate()).toBe(29);
  });

  test('should return dates without previous when initial date is same day as max past date', () => {
    const initialDate = new Date('2020-03-26');
    const maxPreviousDate = new Date('2020-03-26');

    expect(initializeDates(initialDate, maxPreviousDate).previous).toBeUndefined();
  });
});

describe('prepareAgendaTasks', () => {
  test('should correctly order tasks for agenda', () => {
    const initialTasks = agendaTasks;
    const expectedDateKey = '2020-03-31';
    const expectedOrder = [
      { time: '06:00', title: 'first' },
      { time: '07:15', title: 'second' },
      { time: '07:15', title: 'third' }
    ];

    const orderedTasks = prepareAgendaTasks(initialTasks);
    expect(orderedTasks[expectedDateKey]).toBeDefined();
    orderedTasks[expectedDateKey].forEach((entry, index) => {
      expect(entry.title).toEqual(expectedOrder[index].title);
    });
  });
});
