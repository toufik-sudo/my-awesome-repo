import { Injectable, Logger } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, HttpAdapterHost } from '@nestjs/core';
import { PATH_METADATA, METHOD_METADATA, MODULE_PATH } from '@nestjs/common/constants';
import { RequestMethod } from '@nestjs/common';
import {
  generateBackendPermissionKey,
  type HttpMethod,
} from '../utils/generate-backend-permission-key';

export interface MappedBackendRoute {
  controller: string;
  endpoint: string;
  method: string; // GET / POST / ...
  endpoint_url: string;
  permission_key: string;
  module: string;
}

export interface MappedBackendController {
  controller: string;
  endpoints: MappedBackendRoute[];
}

const REQUEST_METHOD_NAME: Record<number, string> = {
  [RequestMethod.GET]: 'GET',
  [RequestMethod.POST]: 'POST',
  [RequestMethod.PUT]: 'PUT',
  [RequestMethod.DELETE]: 'DELETE',
  [RequestMethod.PATCH]: 'PATCH',
  [RequestMethod.OPTIONS]: 'OPTIONS',
  [RequestMethod.HEAD]: 'HEAD',
  [RequestMethod.ALL]: 'ALL',
};

/**
 * Service that introspects all NestJS controllers and produces a live API
 * catalog by scanning route metadata. This is the "source of truth" for what
 * endpoints actually exist in the backend, independent of the rbac DB cache.
 *
 * Used by the RBAC Settings page to:
 *   1. Display the real list of endpoints (instead of relying on DB seeds)
 *   2. Detect "missing" permissions (in code but not in DB)
 *   3. Detect "orphan" permissions (in DB but no longer in code)
 */
@Injectable()
export class BackendRouteMapperService {
  private readonly logger = new Logger(BackendRouteMapperService.name);
  private cache: MappedBackendController[] | null = null;

  constructor(
    private readonly discovery: DiscoveryService,
    private readonly scanner: MetadataScanner,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  /** Returns the live route map. Cached on first call. */
  list(): MappedBackendController[] {
    if (this.cache) return this.cache;
    this.cache = this.scan();
    return this.cache;
  }

  /** Force re-scan on the next list() call. */
  invalidate() {
    this.cache = null;
  }

  /** Flat list of every permission key currently exposed by the running app. */
  listKeys(): string[] {
    return this.list().flatMap(c => c.endpoints.map(e => e.permission_key));
  }

  private scan(): MappedBackendController[] {
    const prefix = this.resolveGlobalPrefix();
    const controllers = this.discovery.getControllers();
    const grouped = new Map<string, MappedBackendRoute[]>();

    for (const wrapper of controllers) {
      const { instance, metatype, host } = wrapper as any;
      if (!instance || !metatype) continue;

      const controllerName = metatype.name as string;
      const controllerPath = (Reflect.getMetadata(PATH_METADATA, metatype) ?? '') as
        | string
        | string[];
      const modulePath = (host && Reflect.getMetadata(MODULE_PATH, host?.metatype)) || '';
      const moduleName = (host?.metatype?.name as string | undefined)?.replace(/Module$/, '') || 'general';

      const proto = Object.getPrototypeOf(instance);
      const methodNames = this.scanner.getAllMethodNames
        ? this.scanner.getAllMethodNames(proto)
        : (this.scanner as any).scanFromPrototype(instance, proto, (n: string) => n);

      for (const methodName of methodNames) {
        const handler = (instance as any)[methodName];
        if (typeof handler !== 'function') continue;

        const routePath = Reflect.getMetadata(PATH_METADATA, handler) as
          | string
          | string[]
          | undefined;
        const methodEnum = Reflect.getMetadata(METHOD_METADATA, handler) as number | undefined;
        if (routePath === undefined || methodEnum === undefined) continue;

        const httpVerb = REQUEST_METHOD_NAME[methodEnum] || 'ALL';
        if (httpVerb === 'ALL' || httpVerb === 'OPTIONS' || httpVerb === 'HEAD') continue;

        const subPaths = Array.isArray(routePath) ? routePath : [routePath];
        const ctrlPaths = Array.isArray(controllerPath) ? controllerPath : [controllerPath];

        for (const cp of ctrlPaths) {
          for (const sp of subPaths) {
            const fullUrl = this.joinUrl(prefix, modulePath, cp, sp);
            const permissionKey = generateBackendPermissionKey(
              controllerName,
              methodName,
              httpVerb as HttpMethod,
            );
            const list = grouped.get(controllerName) || [];
            list.push({
              controller: controllerName,
              endpoint: methodName,
              method: httpVerb,
              endpoint_url: fullUrl,
              permission_key: permissionKey,
              module: moduleName,
            });
            grouped.set(controllerName, list);
          }
        }
      }
    }

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([controller, endpoints]) => ({
        controller,
        endpoints: endpoints.sort(
          (a, b) =>
            a.endpoint.localeCompare(b.endpoint) || a.method.localeCompare(b.method),
        ),
      }));
  }

  private resolveGlobalPrefix(): string {
    try {
      const inst = this.httpAdapterHost?.httpAdapter?.getInstance?.();
      const prefix = inst?.get?.('globalPrefix') ?? inst?.globalPrefix ?? 'api';
      return typeof prefix === 'string' ? prefix : 'api';
    } catch {
      return 'api';
    }
  }

  private joinUrl(...parts: (string | undefined | null)[]): string {
    const cleaned = parts
      .filter(Boolean)
      .map(p => String(p).replace(/^\/+|\/+$/g, ''))
      .filter(p => p.length > 0);
    return '/' + cleaned.join('/');
  }
}
