import * as migration_20260803_153343_applications_localization from './20260803_153343_applications_localization'
import * as migration_20260804_000001_application_launch_fields from './20260804_000001_application_launch_fields'

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
]
