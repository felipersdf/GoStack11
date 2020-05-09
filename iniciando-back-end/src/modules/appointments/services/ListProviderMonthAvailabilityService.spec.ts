import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let listProviderMonthAvailability: ListProviderMonthAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderMonthAvailability', () => {
   beforeEach(() => {
      listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
         fakeAppointmentsRepository,
      );
      fakeAppointmentsRepository = new FakeAppointmentsRepository();
   });

   it('should be able to list the month availability from provider', async () => {
      await fakeAppointmentsRepository.create({
         provider_id: 'user',
         date: new Date(2020, 4, 20, 8, 0, 0),
      });

      await fakeAppointmentsRepository.create({
         provider_id: 'user',
         date: new Date(2020, 4, 20, 10, 0, 0),
      });

      await fakeAppointmentsRepository.create({
         provider_id: 'user',
         date: new Date(2020, 4, 21, 8, 0, 0),
      });

      const availability = await listProviderMonthAvailability.execute({
         provider_id: 'user',
         month: 5,
         year: 2020,
      });

      expect(availability).toEqual(
         expect.arrayContaining([
            { day: 19, available: true },
            { day: 20, available: false },
            { day: 21, available: true },
            { day: 22, available: true },
         ]),
      );
   });
});
