import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayoutAccount } from '../entity/payout-account.entity';

@Injectable()
export class PayoutAccountService {
  constructor(
    @InjectRepository(PayoutAccount)
    private readonly repo: Repository<PayoutAccount>,
  ) {}

  async getForHost(hostUserId: number): Promise<PayoutAccount[]> {
    return this.repo.find({
      where: { hostUserId },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async getAll(): Promise<PayoutAccount[]> {
    return this.repo.find({
      order: { hostUserId: 'ASC', sortOrder: 'ASC' },
      relations: ['host'],
    });
  }

  async create(hostUserId: number, data: Partial<PayoutAccount>): Promise<PayoutAccount> {
    const entity = this.repo.create({ ...data, hostUserId });
    return this.repo.save(entity);
  }

  async update(hostUserId: number, id: string, data: Partial<PayoutAccount>): Promise<PayoutAccount> {
    const entity = await this.repo.findOne({ where: { id, hostUserId } });
    if (!entity) throw new NotFoundException('Payout account not found');
    Object.assign(entity, data);
    return this.repo.save(entity);
  }

  async remove(hostUserId: number, id: string): Promise<void> {
    const entity = await this.repo.findOne({ where: { id, hostUserId } });
    if (!entity) throw new NotFoundException('Payout account not found');
    await this.repo.delete(id);
  }
}
