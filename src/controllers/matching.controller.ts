import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MatchingService } from '../services/matching.service';

@ApiBearerAuth()
@ApiTags('matchings')
@Controller('matchings')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}
}
