import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatformAccount } from '../entity/platform-account.entity';
import { ScopeContext } from '../../rbac/scope-context';

@Injectable()
export class PlatformAccountsService {
  constructor(
    @InjectRepository(PlatformAccount) private readonly repo: Repository<PlatformAccount>,
  ) {}

  /** Public — accounts shown to guests at checkout */
  async listForGuests(): Promise<PlatformAccount[]> {
    return this.repo.find({
      where: { isActive: true, acceptsGuestPayments: true },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  /** Public-ish — accounts shown to hosts when paying their reactivation penalty */
  async listForReactivation(): Promise<PlatformAccount[]> {
    return this.repo.find({
      where: { isActive: true, acceptsReactivationPayments: true },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async listAll(scopeCtx: ScopeContext): Promise<PlatformAccount[]> {
    this.assertHyper(scopeCtx);
    return this.repo.find({ order: { sortOrder: 'ASC', createdAt: 'ASC' } });
  }

  async upsert(data: Partial<PlatformAccount>, scopeCtx: ScopeContext): Promise<PlatformAccount> {
    this.assertHyper(scopeCtx);
    if (data.id) {
      const existing = await this.repo.findOne({ where: { id: data.id } });
      if (!existing) throw new NotFoundException('Platform account not found');
      Object.assign(existing, data);
      return this.repo.save(existing);
    }
    return this.repo.save(this.repo.create(data));
  }

  async remove(id: string, scopeCtx: ScopeContext): Promise<void> {
    this.assertHyper(scopeCtx);
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException('Platform account not found');
  }

  private assertHyper(scopeCtx: ScopeContext) {
    if (!scopeCtx || !['hyper_admin', 'hyper_manager'].includes(scopeCtx.userRole)) {
      throw new ForbiddenException('Only hyper_admin / hyper_manager can manage platform accounts');
    }
  }
}
