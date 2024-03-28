/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotImplementedException } from '@nestjs/common';

export class BaseService {
  /** @deprecated 단일 등록 */
  public createOne = (..._param: any): Promise<any> | any => {
    throw new NotImplementedException();
  };

  /** @deprecated 다중 등록 */
  public createMany = (..._param: any): Promise<any> | any => {
    throw new NotImplementedException();
  };

  /** @deprecated 단일 읽기 */
  public readOne = (..._param: any): Promise<any> | any => {
    throw new NotImplementedException();
  };

  /** @deprecated 다중 읽기 */
  public readMany = (..._param: any): Promise<any> | any => {
    throw new NotImplementedException();
  };

  /** @deprecated ID 로 다중 읽기 */
  public readManyByIds = (..._param: any): Promise<any> | any => {
    throw new NotImplementedException();
  };

  /** @deprecated 다중 수정 */
  public update = (..._param: any): Promise<any> | any => {
    throw new NotImplementedException();
  };

  /** @deprecated ID 로 다중 수정 */
  public updateByIds = (..._param: any): Promise<any> | any => {
    throw new NotImplementedException();
  };

  /** @deprecated 다중 삭제 */
  public delete = (..._param: any): Promise<any> | any => {
    throw new NotImplementedException();
  };

  /** @deprecated ID 로 다중 삭제 */
  public deleteByIds = (..._param: any): Promise<any> | any => {
    throw new NotImplementedException();
  };

  /** @deprecated 숫자 카운팅 */
  public count = (..._param: any): Promise<any> | any => {
    throw new NotImplementedException();
  };

  /** @deprecated 조건에 해당하는 것 1개를 무조건 가져오기 */
  public confirmOne = (..._param: any): Promise<any> | any => {
    throw new NotImplementedException();
  };

  /** @deprecated Upsert 1개 */
  public upsertOne = (..._param: any): Promise<any> | any => {
    throw new NotImplementedException();
  };
}
