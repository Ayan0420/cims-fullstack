import { PartialType } from '@nestjs/mapped-types';
import { CreateCtJomLegacyDto } from './create-ct-jom-legacy.dto';

export class UpdateCtJomLegacyDto extends PartialType(CreateCtJomLegacyDto) {}
