import AppError from '@shared/errors/AppError';

import FakeHashRepository from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashRepository: FakeHashRepository;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
   beforeEach(() => {
      fakeUsersRepository = new FakeUsersRepository();
      fakeHashRepository = new FakeHashRepository();

      updateProfile = new UpdateProfileService(
         fakeUsersRepository,
         fakeHashRepository,
      );
   });
   it('should be able to update the profile', async () => {
      const user = await fakeUsersRepository.create({
         name: 'John Doe',
         email: 'johndoe@email.com',
         password: '123456',
      });

      const updatedUser = await updateProfile.execute({
         user_id: user.id,
         name: 'John Tre',
         email: 'johntre@email.com',
      });

      expect(updatedUser.name).toBe('John Tre');
      expect(updatedUser.email).toBe('johntre@email.com');
   });

   it('should not be able to update profile from non-existing user', async () => {
      expect(
         updateProfile.execute({
            user_id: 'non-existing user id',
            name: 'John Tre',
            email: 'johntre@email.com',
            old_password: 'wrong-old-password',
            password: '123123',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });

   it('should not be able to change to another user email', async () => {
      await fakeUsersRepository.create({
         name: 'John Doe',
         email: 'johndoe@email.com',
         password: '123456',
      });

      const user = await fakeUsersRepository.create({
         name: 'John Test',
         email: 'johntest@email.com',
         password: '123456',
      });

      await expect(
         updateProfile.execute({
            user_id: user.id,
            name: 'John Tre',
            email: 'johndoe@email.com',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });

   it('should be able to update the password', async () => {
      const user = await fakeUsersRepository.create({
         name: 'John Doe',
         email: 'johndoe@email.com',
         password: '123456',
      });

      const updatedUser = await updateProfile.execute({
         user_id: user.id,
         name: 'John Tre',
         email: 'johntre@email.com',
         old_password: '123456',
         password: '123123',
      });

      expect(updatedUser.password).toBe('123123');
   });

   it('should not be able to update the password without old password', async () => {
      const user = await fakeUsersRepository.create({
         name: 'John Doe',
         email: 'johndoe@email.com',
         password: '123456',
      });

      await expect(
         updateProfile.execute({
            user_id: user.id,
            name: 'John Tre',
            email: 'johntre@email.com',
            password: '123123',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });

   it('should not be able to update the password with wrong old password', async () => {
      const user = await fakeUsersRepository.create({
         name: 'John Doe',
         email: 'johndoe@email.com',
         password: '123456',
      });

      await expect(
         updateProfile.execute({
            user_id: user.id,
            name: 'John Tre',
            email: 'johntre@email.com',
            old_password: 'wrong-old-password',
            password: '123123',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });
});
