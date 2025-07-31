import { EnvDto } from '@common/env/env.dto';

export default () => process.env as unknown as EnvDto;
