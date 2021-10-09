import { Connection } from 'typeorm';
import { Parameter } from '../entities/parameter.entity';

export const ParameterFactory = {
  build: (connection: Connection): Parameter[] => {
    const items = [
      // Email parameters
      {
        name: 'UPDATED_PASSWORD_EMAIL_SUBJECT',
        value: 'Construction Assistant - Account password changed',
        description:
          'Subject of the email confirming the account password change'
      },
      {
        name: 'PASSWORD_RESET_EMAIL_SUBJECT',
        value: 'Construction Assistant - Password Reset Instructions',
        description: 'Email subject for password reset instructions'
      }
    ];

    return items.map(item =>
      connection.getRepository(Parameter).create({
        name: item.name,
        value: item.value,
        description: item.description
      })
    );
  },

  handle: async (connection: Connection): Promise<void> => {
    const items = ParameterFactory.build(connection);

    for (const item of items) {
      const existing = await connection
        .getRepository(Parameter)
        .createQueryBuilder('p')
        .where('p.name = :name', { name: item.name })
        .getOne();

      let itemToSave: any;

      if (existing) {
        itemToSave = await connection.getRepository(Parameter).preload({
          id: existing.id,
          value: item.value,
          description: item.description
        });
      } else itemToSave = item;

      await connection.getRepository(Parameter).save(itemToSave);
    }
  },

  entity: Parameter
};
