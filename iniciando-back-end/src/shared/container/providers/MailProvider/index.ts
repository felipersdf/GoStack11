import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import IMailProvider from './models/IMailProvider';

import EtherealMailProvider from './implementations/EtheralMailProvider';
import SESMailProvider from './implementations/SESMailProvider';

const providers = {
   ethereal: container.resolve(EtherealMailProvider),
   ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
   'MailProvider',
   providers[mailConfig.driver],
);
