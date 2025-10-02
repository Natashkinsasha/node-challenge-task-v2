import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { FastifyAdapter } from "@bull-board/fastify";
import type { FastifyBasicAuthOptions } from "@fastify/basic-auth";
import basicAuth from "@fastify/basic-auth";
import type {
  DynamicModule,
  ModuleMetadata,
  NestModule,
  Type,
} from "@nestjs/common";
import { HttpStatus, Module, UnauthorizedException } from "@nestjs/common";
import { HttpAdapterHost, ModuleRef } from "@nestjs/core";
import { Queue } from "bullmq";
import type { FastifyInstance } from "fastify";
import { QueueRegistryService } from "../../job/src";

export interface JobBoardModuleOptions {
  route: string;
  username: string;
  password: string;
  enabled?: boolean;
}

export interface JobBoardModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  useFactory?: (
    ...args: any[]
  ) => Promise<JobBoardModuleOptions> | JobBoardModuleOptions;
  inject?: any[];
  useClass?: Type<JobBoardModuleOptionsFactory>;
  useExisting?: Type<JobBoardModuleOptionsFactory>;
}

export interface JobBoardModuleOptionsFactory {
  createJobBoardOptions():
    | Promise<JobBoardModuleOptions>
    | JobBoardModuleOptions;
}

const JOB_BOARD_OPTIONS = "JOB_BOARD_OPTIONS";

@Module({})
export class JobBoardModule implements NestModule {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly adapterHost: HttpAdapterHost,
    private readonly queueRegistry: QueueRegistryService
  ) {}

  static forRootAsync(options: JobBoardModuleAsyncOptions): DynamicModule {
    return {
      module: JobBoardModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options)],
    };
  }

  private static createAsyncProviders(options: JobBoardModuleAsyncOptions) {
    if (options.useFactory) {
      return [
        {
          provide: JOB_BOARD_OPTIONS,
          useFactory: async (...args: any[]) => {
            const config = await options.useFactory!(...args);
            return {
              enabled: true,
              ...config,
            };
          },
          inject: options.inject || [],
        },
      ];
    }

    if (options.useClass) {
      return [
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
        {
          provide: JOB_BOARD_OPTIONS,
          useFactory: async (optionsFactory: JobBoardModuleOptionsFactory) => {
            const config = await optionsFactory.createJobBoardOptions();
            return {
              enabled: true,
              ...config,
            };
          },
          inject: [options.useClass],
        },
      ];
    }

    if (options.useExisting) {
      return [
        {
          provide: JOB_BOARD_OPTIONS,
          useFactory: async (optionsFactory: JobBoardModuleOptionsFactory) => {
            const config = await optionsFactory.createJobBoardOptions();
            return {
              enabled: true,
              ...config,
            };
          },
          inject: [options.useExisting],
        },
      ];
    }

    return [];
  }

  private getQueueByName(queueName: string): Queue {
    return this.moduleRef.get<Queue, Queue>(`BullQueue_${queueName}`, {
      strict: false,
    });
  }

  private getQueuesByNames(queueNames: string[]): Queue[] {
    return queueNames.map((name) => this.getQueueByName(name));
  }

  configure() {
    const options = this.moduleRef.get<JobBoardModuleOptions>(
      JOB_BOARD_OPTIONS,
      {
        strict: false,
      }
    );

    if (!options?.enabled) {
      return;
    }

    const route = options.route;
    const username = options.username;
    const password = options.password;

    const serverAdapter = new FastifyAdapter();
    serverAdapter.setBasePath(route);

    const queueNames = this.queueRegistry.getAll();
    createBullBoard({
      queues: this.getQueuesByNames(queueNames).map(
        (queue) => new BullMQAdapter(queue)
      ),
      serverAdapter,
    });

    const app = this.adapterHost.httpAdapter.getInstance<FastifyInstance>();

    const authenticate: FastifyBasicAuthOptions["authenticate"] = true;

    const validate: FastifyBasicAuthOptions["validate"] = async (
      user,
      pass
    ) => {
      if (user !== username || pass !== password) {
        throw new UnauthorizedException();
      }
    };

    app.register(basicAuth, {
      validate,
      authenticate,
    });

    const bullboardPlugin = serverAdapter.registerPlugin();

    app.register(async (instance) => {
      instance.addHook("onRequest", (req, reply, next) => {
        instance.basicAuth(req, reply, function (error: any) {
          if (!error) {
            return next();
          }

          const statusCode =
            (error as any).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
          reply.code(statusCode).send({ error: error.name });
        });
      });

      (instance as any).register(bullboardPlugin, {
        prefix: route,
      });
    });
  }
}
