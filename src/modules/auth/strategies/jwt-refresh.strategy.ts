import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { verify } from "argon2";
import { PrismaService } from "../../../database/prisma/prisma.service";
import { JwtPayload } from "./jwt.strategy";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow<string>("JWT_REFRESH_SECRET"),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const rawToken = req.get("Authorization")?.replace("Bearer ", "").trim();
    if (!rawToken) throw new UnauthorizedException();

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.refresh_token) throw new UnauthorizedException();

    const tokenMatches = await verify(user.refresh_token, rawToken);
    if (!tokenMatches) throw new UnauthorizedException();

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      refreshToken: rawToken,
    };
  }
}
