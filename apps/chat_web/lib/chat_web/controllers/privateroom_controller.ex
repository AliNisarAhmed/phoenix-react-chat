defmodule ChatWeb.PrivateRoomController do
  use ChatWeb, :controller

  alias Chat.PrivateRooms

  action_fallback ChatWeb.FallbackController

  def index(conn, %{"room_id" => room_id, "username" => username}) do
    with room <- PrivateRooms.get_private_room(room_id),
         true <- PrivateRooms.is_invited?(username, room) do
      render(conn, "index.json", %{room: room, is_owner: room.owner == username})
    else
      false -> {:error, :unauthorized}
      _ -> {:error, :not_found}
    end
  end

  def create(conn, params) do
    with {:ok, room} <- PrivateRooms.create_private_room(params) do
      IO.inspect(room, label: "CREATED ROOM")

      for username <- room.invitees do
        ChatWeb.Endpoint.broadcast!("users:" <> username, "invitation", %{
          room_id: room.room_id,
          owner: room.owner,
          topic: room.topic
        })
      end

      render(conn, "create.json", %{room: room})
    end
  end

  def accept_invite(conn, %{"username" => username, "invite_code" => invite_code}) do
    with room <- PrivateRooms.get_room_by_code(invite_code) do
      PrivateRooms.add_user_to_room(room, username)

      render(conn, "create.json", %{room: room})
    end
  end
end
