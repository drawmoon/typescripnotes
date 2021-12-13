import { classes } from '@automapper/classes';
import { createMapper } from '@automapper/core';
import { UserProfile } from './mapper-profile';

export const Mapper = createMapper({
  name: 'userMapper',
  pluginInitializer: classes,
});

Mapper.addProfile(UserProfile);