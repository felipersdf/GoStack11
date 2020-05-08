import AppError from '@shared/errors/AppError';

import FakeStorageRepository from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageRepository: FakeStorageRepository;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
   beforeEach(() => {
      fakeUsersRepository = new FakeUsersRepository();
      fakeStorageRepository = new FakeStorageRepository();

      updateUserAvatar = new UpdateUserAvatarService(
         fakeUsersRepository,
         fakeStorageRepository,
      );
   });
   it('should be able to update a avatar', async () => {
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
      await expect(
         updateUserAvatar.execute({
            user_id: 'non-existing-user',
            avatarFilename: 'avatar.jpg',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });

   it('should be delete old avatar when updating new one', async () => {
      const deleteFile = jest.spyOn(fakeStorageRepository, 'deleteFile');

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
