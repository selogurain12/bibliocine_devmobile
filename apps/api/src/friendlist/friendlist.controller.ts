import { Controller, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/authentification/authentification.guard";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { friendlistContract } from "@biblio-cine/source";
import { FriendlistService } from "./friendlist.service";

@Controller()
@UseGuards(AuthGuard)
export class FriendlistController {
  private readonly service: FriendlistService;

  public constructor(service: FriendlistService) {
    this.service = service;
  }

  @TsRestHandler(friendlistContract)
  public handle() {
    return tsRestHandler(friendlistContract, {
      getAllFriendlist: async ({ params: parameters }) => {
        const friendlists = await this.service.getAllFriend(parameters.userId);
        return { status: 200, body: friendlists };
      },
      updateFriendlist: async ({ params: parameters, body: dto }) => {
        const friendlist = await this.service.update(parameters.id, parameters.userId, dto);
        return { status: 200, body: friendlist };
      },
      deleteFriend: async ({ params: parameters }) => {
        await this.service.removeFriend(parameters.userId, parameters.id);
        return { status: 200, body: undefined };
      },
    });
  }
}
