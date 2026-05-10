import { Global, Module } from '@nestjs/common';
import { MaterializedViewService } from '../services/materialized-view.service';

/**
 * Global module exposing the MaterializedViewService everywhere without
 * requiring each feature module to re-import it.
 */
@Global()
@Module({
  providers: [MaterializedViewService],
  exports: [MaterializedViewService],
})
export class MaterializedViewModule {}
