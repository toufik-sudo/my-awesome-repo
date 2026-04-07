import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScopeFilterService } from './services/scope-filter.service';
import { PropertyGroupMembership } from '../properties/entity/property-group-membership.entity';
import { ServiceGroupMembership } from '../services/entity/service-group-membership.entity';
import { Property } from '../properties/entity/property.entity';
import { TourismService } from '../services/entity/tourism-service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PropertyGroupMembership,
      ServiceGroupMembership,
      Property,
      TourismService,
    ]),
  ],
  providers: [ScopeFilterService],
  exports: [ScopeFilterService],
})
export class RbacScopeModule {}
