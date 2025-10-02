import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { TokenMaintainer } from "../../application/maintainer/token.maintainer";
import { CreateTokenBody } from "../dto/body/create-token.body";
import { CreateTokenResponse } from "../dto/response/create-token.response";

@ApiTags("token")
@Controller("api/v1/tokens")
export class TokenController {
  constructor(private readonly tokenMaintainer: TokenMaintainer) {}

  @Post()
  @ZodResponse({ type: CreateTokenResponse })
  public createToken(
    @Body() body: CreateTokenBody
  ): Promise<CreateTokenResponse> {
    return this.tokenMaintainer.createToken({ ...body });
  }
}
