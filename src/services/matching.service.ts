import { Injectable } from '@nestjs/common';
import { BaseService } from '.';
import { MatchingRepository } from '../repositories/matching.repository';

@Injectable()
export class MatchingService extends BaseService {
  constructor(private readonly matchingRepository: MatchingRepository) {
    super();
  }

  confirmOne = this.matchingRepository.confirmOne;
}
