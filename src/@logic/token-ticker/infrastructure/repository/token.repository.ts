import { Injectable } from "@nestjs/common";
import { Token } from "../../domain/aggregate/token";
import { TokenDao } from "../dao/token.dao";

@Injectable()
export class TokenRepository {
  constructor(private readonly tokenDao: TokenDao) {}

  public async findById(id: string): Promise<Token | undefined> {
    const row = await this.tokenDao.findById(id);
    if (!row) {
      return;
    }
    return new Token(row);
  }
}
