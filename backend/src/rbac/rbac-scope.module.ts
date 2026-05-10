import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScopeFilterService } from './services/scope-filter.service';
import { PropertyGroup } from '../properties/entity/property-group.entity';
import { ServiceGroup } from '../services/entity/service-group.entity';
import { Property } from '../properties/entity/property.entity';
import { TourismService } from '../services/entity/tourism-service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PropertyGroup,
      ServiceGroup,
      Property,
      TourismService,
    ]),
  ],
  providers: [ScopeFilterService],
  exports: [ScopeFilterService],
})
export class RbacScopeModule {}
