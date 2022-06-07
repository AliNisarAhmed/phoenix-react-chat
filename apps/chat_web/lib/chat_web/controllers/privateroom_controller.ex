defmodule ChatWeb.PrivateRoomController do
  use ChatWeb, :controller

  alias Chat.PrivateRooms

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
end
