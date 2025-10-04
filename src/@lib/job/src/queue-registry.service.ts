import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueRegistryService {
  private readonly names = new Set<string>();

  add(name: string) {
    this.names.add(name);
  }

  getAll(): string[] {
    return [...this.names];
  }

  has(name: string): boolean {
    return this.names.has(name);
  }
}
