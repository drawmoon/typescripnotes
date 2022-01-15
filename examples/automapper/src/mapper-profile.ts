import { CamelCaseNamingConvention, MappingProfile, mapFrom } from '@automapper/core';
import { UserDTO } from './user.dto';
import { User } from './user';

export const UserProfile: MappingProfile = (mapper) => {
  mapper
    .createMap(User, UserDTO, {
      namingConventions: {
        source: new CamelCaseNamingConvention(),
        destination: new CamelCaseNamingConvention(),
      }
    })
    .forMember(
      (destination) => destination.fullName, 
      mapFrom((source) => source.firstName + source.lastName));
}
