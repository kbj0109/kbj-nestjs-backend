import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MatchingService } from '../services/matching.service';
import { validateParameter, validateValueToInt } from '../utils/dto.util';
import { ListInput } from '../constant/dto.constant';
import { MatchingsOutput } from './matching.controller.dto';
import { MatchingDTO } from '../repositories/schema/matching.schema';
import { UserAuthGuard } from '../guards/user.auth.guard.';
import { LoginUser } from '../decorators/parameter.decorator';

@ApiBearerAuth()
@ApiTags('matchings')
@Controller('matchings')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @ApiResponse({ status: 200, type: MatchingsOutput })
  @UserAuthGuard()
  @Get()
  async ReadMany(@Query() query: ListInput, @LoginUser() loginUser: LoginUserType): Promise<MatchingsOutput> {
    const { skip, take } = validateParameter(query, {
      skip: validateValueToInt({ optional: true, min: 0 }),
      take: validateValueToInt({ optional: true, max: 1000 }),
    });

    const { list, totalCount } = await this.matchingService.readManyAndTotalCountWithUser(loginUser.userId, {
      skip,
      take,
    });
    list.forEach((one) => delete (one.matchingUser as any).password);

    return { totalCount, list: list.map((item) => new MatchingDTO(item)) as any };
  }
}
