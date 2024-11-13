import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

// Constant to define the key used to store roles metadata
export const ROLES_KEY = 'roles';

// Custom decorator to set roles metadata on route handlers or classes
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
