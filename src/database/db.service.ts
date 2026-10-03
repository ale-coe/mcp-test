import { Injectable } from '@nestjs/common';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';

@Injectable()
export class DbService {
  constructor(private readonly dataSource: DataSource) {}

  getRepo<T extends ObjectLiteral>(repo: EntityTarget<T>) {
    return this.dataSource.getRepository(repo);
  }
}
