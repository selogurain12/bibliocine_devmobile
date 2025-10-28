import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { User } from "src/user/user.entity";
import { AuthGuard } from "./authentification.guard";
import { AuthService } from "./authentification.service";

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
    }),
  ],
  providers: [AuthGuard, AuthService],
  exports: [AuthGuard, JwtModule, AuthService],
})
export class AuthentificationModule {}
