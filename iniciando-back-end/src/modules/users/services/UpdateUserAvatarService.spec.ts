import AppError from '@shared/errors/AppError';

import FakeStorageRepository from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
   it('should be able to update a avatar', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeStorageRepository = new FakeStorageRepository();

      const updateUserAvatar = new UpdateUserAvatarService(
         fakeUsersRepository,
         fakeStorageRepository,
      );

      const user = await fakeUsersRepository.create({
         name: 'John Doe',
         email: 'johndoe@email.com',
         password: '123456',
      });

      await updateUserAvatar.execute({
         user_id: user.id,
         avatarFilename: 'avatar.jpg',
      });

      expect(user.avatar).toBe('avatar.jpg');
   });

   it('should not be able to update avatar from non existing user', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeStorageRepository = new FakeStorageRepository();

      const updateUserAvatar = new UpdateUserAvatarService(
         fakeUsersRepository,
         fakeStorageRepository,
      );

      await expect(
         updateUserAvatar.execute({
            user_id: 'non-existing-user',
            avatarFilename: 'avatar.jpg',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });

   it('should be delete old avatar when updating new one', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeStorageRepository = new FakeStorageRepository();

      const deleteFile = jest.spyOn(fakeStorageRepository, 'deleteFile');

      const updateUserAvatar = new UpdateUserAvatarService(
         fakeUsersRepository,
         fakeStorageRepository,
      );

      const user = await fakeUsersRepository.create({
         name: 'John Doe',
         email: 'johndoe@email.com',
         password: '123456',
      });

      await updateUserAvatar.execute({
         user_id: user.id,
         avatarFilename: 'avatar.jpg',
      });

      await updateUserAvatar.execute({
         user_id: user.id,
         avatarFilename: 'avatar2.jpg',
      });

      expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
      expect(user.avatar).toBe('avatar2.jpg');
   });
});
