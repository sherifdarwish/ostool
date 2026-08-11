import * as migration_20260803_153343_applications_localization from './20260803_153343_applications_localization'
import * as migration_20260804_000001_application_launch_fields from './20260804_000001_application_launch_fields'
import * as migration_20260811_000001_secure_user_roles from './20260811_000001_secure_user_roles'

export const migrations = [
  {
    up: migration_20260803_153343_applications_localization.up,
    down: migration_20260803_153343_applications_localization.down,
    name: '20260803_153343_applications_localization',
  },
  {
    up: migration_20260804_000001_application_launch_fields.up,
    down: migration_20260804_000001_application_launch_fields.down,
    name: '20260804_000001_application_launch_fields',
  },
  {
    up: migration_20260811_000001_secure_user_roles.up,
    down: migration_20260811_000001_secure_user_roles.down,
    name: '20260811_000001_secure_user_roles',
  },
]
