import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListInput } from '../constant/dto.constant';
import { LoginUser } from '../decorators/parameter.decorator';
import { UserAuthGuard } from '../guards/user.auth.guard.';
import { MatchingDTO } from '../repositories/schema/matching.schema';
import { MatchingService } from '../services/matching.service';
import { validateParameter, validateValueToInt } from '../utils/dto.util';
import { MatchingListOutput } from './matching.controller.dto';

@ApiBearerAuth()
@ApiTags('matchings')
@Controller('matchings')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @ApiResponse({ status: 200, type: MatchingListOutput })
  @UserAuthGuard()
  @Get()
  async ReadMany(@Query() query: ListInput, @LoginUser() loginUser: LoginUserType): Promise<MatchingListOutput> {
    const queryOption = validateParameter(query, {
      skip: validateValueToInt({ optional: true, min: 0 }),
      take: validateValueToInt({ optional: true, max: 1000 }),
    });

    const result = await this.matchingService.readManyAndTotalCountWithUserAndMessage(loginUser.userId, queryOption);
    result.list.forEach((one) => delete (one.matchingUser as any).password);

    return { ...result, list: result.list.map((item) => new MatchingDTO(item)) as any };
  }
}
